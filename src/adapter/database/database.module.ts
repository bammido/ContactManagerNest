import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';

import { DataSource } from 'typeorm';

import { Groups } from './entities/group.entity';
import { GroupRepository } from './repository/group.repository';

const envFilePath = path.resolve(__dirname, `../../../../.env`);

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        console.log(configService.get('DB_HOST'))

        return ({
            type: 'postgres',
            host: configService.get('DB_HOST'),
            port: configService.get('DB_PORT') || 1433,
            username: configService.get('DB_USER'),
            password: configService.get('DB_PASS'),
            database: configService.get('DB_NAME'),
            entities: [__dirname + './entities/*.entity{.ts,.js}'],
            synchronize: false,
            logging: ['error', 'warn'],
            maxQueryExecutionTime: 1200,
            // extra: {
            //   options: {
            //     encrypt: false,
            //   },
            // },
            options: {
              useUTC: true,
            },
            // autoLoadEntities: true,
          })
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Groups]),
  ],
  providers: [
    {
      provide: 'PHOTO_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Groups),
      inject: ['DATA_SOURCE'],
    },
    GroupRepository],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
