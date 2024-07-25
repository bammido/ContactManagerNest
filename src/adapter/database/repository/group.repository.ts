import { Raw, Repository } from 'typeorm';
import { Groups } from '../entities/group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GroupRepository {
  constructor(
    @Inject('PHOTO_REPOSITORY')
    private readonly group: Repository<Groups>,
  ) {}

//   public async findOneByParamaters(
//     subscription: number,
//     clientCode?: string,
//     name?: string,
//   ): Promise<Associate> {
//     return await this.associate.findOne({
//       where: {
//         subscription: subscription || Raw(() => '1=1'),
//         clientCode: clientCode || Raw(() => '1=1'),
//         name: name || Raw(() => '1=1'),
//       },
//     });
//   }

  public async findAll(): Promise<Groups[]> {
    return await this.group.find()
  }

//   public async createAssociate(associate: Partial<Associate>): Promise<void> {
//     await this.associate.save(associate);
//   }
}
