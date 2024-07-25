import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdapterModule } from './adapter/adapter.module';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { groupProviders } from './adapter/database/providers/groups.providers';
import { DatabaseModule } from './adapter/database/database.module';
import { databaseProviders } from './adapter/database/database.providers';

const envFilePath = path.resolve(__dirname, '../.env');

@Module({
  imports: [
    DatabaseModule,
    AdapterModule,
    ConfigModule.forRoot({
      envFilePath: envFilePath,
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ...databaseProviders, ...groupProviders],
})
export class AppModule {}
