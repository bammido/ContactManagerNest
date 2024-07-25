import { DataSource } from 'typeorm';
import { Groups } from '../entities/group.entity';

export const photoProviders = [
  {
    provide: 'PHOTO_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Groups),
    inject: ['DATA_SOURCE'],
  },
];