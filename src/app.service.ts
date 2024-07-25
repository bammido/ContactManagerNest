import { Inject, Injectable } from '@nestjs/common';
import { Group } from './adapter/database/entities/group.entity';
import { Repository } from 'typeorm';
import { groupProviders } from './adapter/database/providers/groups.providers';
import { Contact } from './adapter/database/entities/contact.entity';
import { contactProviders } from './adapter/database/providers/contact.providers';

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
    return await this.groupRepository.find()
  }

  async getContacts(): Promise<Contact[]> {
    return await this.contactRepository.find()
  }
}
