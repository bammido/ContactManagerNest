import { Inject, Injectable } from '@nestjs/common';
import { Group } from './adapter/database/entities/group.entity';
import { Repository } from 'typeorm';
import { groupProviders } from './adapter/database/providers/groups.providers';
import { Contact } from './adapter/database/entities/contact.entity';
import { contactProviders } from './adapter/database/providers/contact.providers';

import * as XLSX from 'xlsx';
// import { promises as fs } from 'fs';
import * as path from 'path';
import * as Papa from 'papaparse';
import * as fs from 'fs';

@Injectable()
export class AppService {
  constructor(
    @Inject(groupProviders[0].provide)
    private readonly groupRepository: Repository<Group>,

    @Inject(contactProviders[0].provide)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getGroups(): Promise<Group[]> {
    return await this.groupRepository.find({
      relations: {
        contacts: true,
      },
    });
  }

  async createOneGroup({
    groupName,
    filePath,
    fileMimetype,
  }: {
    groupName: string;
    filePath: string;
    fileMimetype: string;
  }): Promise<{ group: Group; contactsErr?: boolean }> {
    const newGroup = await this.groupRepository.create({ groupName });

    const insertedGroup = await this.groupRepository.save(newGroup);

    try {
      const contacts = await this.processFile(filePath, fileMimetype);
      await this.createManyContacts({
        contacts,
        groupId: insertedGroup.id,
      });

      return { group: newGroup };
    } catch (error) {
      return { group: newGroup, contactsErr: true };
    }
  }

  async createManyContacts({
    groupId,
    contacts,
  }: {
    groupId: string;
    contacts: Contact[];
  }) {
    const contactEntities = contacts.map((contact) => ({
      ...contact,
      groupId,
    }));


    return await this.contactRepository.insert(contactEntities);
  }

  async getGroupById(id: string): Promise<Group> {
    return await this.groupRepository.findOne({
      where: {
        id,
      },
      relations: {
        contacts: true,
      },
    });
  }

  async getContacts(): Promise<Contact[]> {
    return await this.contactRepository.find({
      relations: {
        group: true,
      },
    });
  }

  async processFile(filePath: string, fileMimetype: string): Promise<any> {


    switch (fileMimetype) {
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        const workbook = XLSX.readFile(filePath, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const processedData = data.map((row: any[]) => {
          return {
            name: row[0],
            number: row[1],
          };
        });

        return processedData;

      case 'text/csv':
        const fileContentCsv = fs.readFileSync(filePath, 'utf8');
        const parsedData = Papa.parse(fileContentCsv, { header: false });
        const contactsCsv = parsedData.data.slice(1).map((row: any[]) => ({
          name: row[0],
          number: row[1],
        }));

        return contactsCsv;

      case 'text/plain':
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const lines = fileContent.split('\n');
        const contacts = lines.slice(1).map((line) => {
          const [name, number] = line.split(',');
          return { name, number: number.replace(/\D/g, '') };
        });
        return contacts;
      default:
        throw new Error('Unsupported file type');
    }
  }
}
