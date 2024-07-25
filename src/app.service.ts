import { Injectable } from '@nestjs/common';
import { GroupRepository } from './adapter/database/repository/group.repository';
import { Groups } from './adapter/database/entities/group.entity';

@Injectable()
export class AppService {
  constructor(
    private readonly groupRepository: GroupRepository,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getGroups(): Promise<Groups[]> {
    return await this.groupRepository.findAll()
  }
}
