import { Inject, Injectable } from '@nestjs/common';
import { Group } from './adapter/database/entities/group.entity';
import { Repository } from 'typeorm';
import { groupProviders } from './adapter/database/providers/groups.providers';
import { Contact } from './adapter/database/entities/contact.entity';
import { contactProviders } from './adapter/database/providers/contact.providers';

import * as XLSX from 'xlsx';
import * as Papa from 'papaparse';
import * as fs from 'fs';
import { userProviders } from './adapter/database/providers/user.providers';
import { User } from './adapter/database/entities/user.entity';

import { SignJWT } from 'jose';

@Injectable()
export class AppService {
  constructor(
    @Inject(groupProviders[0].provide)
    private readonly groupRepository: Repository<Group>,

    @Inject(contactProviders[0].provide)
    private readonly contactRepository: Repository<Contact>,

    @Inject(userProviders[0].provide)
    private readonly userRepository: Repository<User>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async login(body: {
    email: string;
    password: string;
  }): Promise<string | null> {
    const user = await this.userRepository.findOne({
      where: body,
    });

    if (!user) {
      return null;
    }

    const secretKey = process.env.SECRET;
    const key = new TextEncoder().encode(secretKey);
    const token = await new SignJWT({ email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1 day from now')
      .sign(key);

    return token;
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
    contacts: { name: string; number: string }[];
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

  async createOneContact(newContact: {
    name: string;
    number: string;
    groupId: string;
  }): Promise<Contact> {
    const newContactEntity = await this.contactRepository.create(newContact);
    return await this.contactRepository.save(newContactEntity);
  }

  async editOneContact(newContact: {
    name: string;
    number: string;
    id: string;
    groupId: string;
  }): Promise<any> {
    const updateResult = await this.contactRepository.update(
      newContact.id,
      newContact,
    );
    return updateResult;
  }

  async deleteOneContact(id: string): Promise<any> {
    const updateResult = await this.contactRepository.delete(id);
    return updateResult;
  }

  async processFile(
    filePath: string,
    fileMimetype: string,
  ): Promise<{ name: string; number: string }[]> {
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
