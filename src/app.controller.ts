import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Group } from './adapter/database/entities/group.entity';
import { Contact } from './adapter/database/entities/contact.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/groups')
  async getGroups(): Promise<Group[]> {
    const groups = await this.appService.getGroups();
    return groups;
  }

  @Get('/contacts')
  async getContacts(): Promise<Contact[]> {
    const contacts = await this.appService.getContacts();
    return contacts;
  }

  @Post('/sendFile')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any) {
    const filePath = file?.path;

    const data = await this.appService.processFile(filePath);
    return { data };
  }
}
