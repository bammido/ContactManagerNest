import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdapterModule } from './adapter/adapter.module';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { GroupRepository } from './adapter/database/repository/group.repository';

const envFilePath = path.resolve(__dirname, '../.env')

@Module({
  imports: [
    AdapterModule, 
    ConfigModule.forRoot({
      envFilePath: envFilePath,
      isGlobal: true,
    })
  ],
  controllers: [AppController],
  providers: [AppService, GroupRepository],
})
export class AppModule {}
