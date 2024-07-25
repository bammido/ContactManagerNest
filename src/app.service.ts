import { Inject, Injectable } from '@nestjs/common';
import { Group } from './adapter/database/entities/group.entity';
import { Repository } from 'typeorm';
import { groupProviders } from './adapter/database/providers/groups.providers';
import { Contact } from './adapter/database/entities/contact.entity';
import { contactProviders } from './adapter/database/providers/contact.providers';

import * as XLSX from 'xlsx';
import { promises as fs } from 'fs';
import * as path from 'path';

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

  async getContacts(): Promise<Contact[]> {
    return await this.contactRepository.find({
      relations: {
        group: true,
      },
    });
  }

  async processFile(filePath: string): Promise<any> {
    const fileBuffer = await fs.readFile(filePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

    // Exemplo de como acessar a primeira planilha
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const processedData = data.map((row: any[]) => {
      return {
        nome: row[0], // Assume que o nome está na primeira coluna
        numero: row[1], // Assume que o número está na segunda coluna
      };
    });

    return processedData;
  }
}
