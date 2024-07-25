import { Inject, Injectable } from '@nestjs/common';
import { Group } from './adapter/database/entities/group.entity';
import { Repository } from 'typeorm';
import { groupProviders } from './adapter/database/providers/groups.providers';

@Injectable()
export class AppService {
  constructor(
    @Inject(groupProviders[0].provide)
    private readonly groupRepository: Repository<Group>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getGroups(): Promise<Group[]> {
    return await this.groupRepository.find()
  }
}
