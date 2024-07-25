import { Inject, Injectable } from '@nestjs/common';
// import { GroupRepository } from './adapter/database/repository/group.repository';
import { Groups } from './adapter/database/entities/group.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @Inject('PHOTO_REPOSITORY')
    private readonly groupRepository: Repository<Groups>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getGroups(): Promise<Groups[]> {
    return await this.groupRepository.find()
  }
}
