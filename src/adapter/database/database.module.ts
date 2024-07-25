import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { databaseProviders } from './database.providers';
import { groupProviders } from './providers/groups.providers';

const envFilePath = path.resolve(__dirname, `../../../../.env`);

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
    }),
  ],
  providers: [...databaseProviders, ...groupProviders],
})
export class DatabaseModule {}
