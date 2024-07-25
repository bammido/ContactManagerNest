import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';

import { DataSource } from 'typeorm';

import { Groups } from './entities/group.entity';
import { GroupRepository } from './repository/group.repository';
import { databaseProviders } from './database.providers';
import { photoProviders } from './providers/groups.provider';

const envFilePath = path.resolve(__dirname, `../../../../.env`);

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
    }),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    // }),
    // TypeOrmModule.forFeature([Groups]),
  ],
  providers: [
    ...databaseProviders,
    ...photoProviders  
  ],
  // exports: [TypeOrmModule],
})
export class DatabaseModule {}
