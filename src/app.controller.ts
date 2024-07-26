import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  Param,
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

  @Post('/groups')
  @UseInterceptors(FileInterceptor('file'))
  async postGroup(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { groupName: string },
  ): Promise<any> {
    const filePath = file?.path;

    const groups = await this.appService.createOneGroup({
      groupName: body.groupName,
      filePath,
      fileMimetype: file.mimetype,
    });
    return groups;
  }

  @Get('/groups/:id')
  async getGroupById(@Param('id') id: string): Promise<Group> {
    const group = await this.appService.getGroupById(id);
    return group;
  }

  @Get('/contacts')
  async getContacts(): Promise<Contact[]> {
    const contacts = await this.appService.getContacts();
    return contacts;
  }

  @Post('/sendFile')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: FormData,
  ) {
    const filePath = file?.path;

    const data = await this.appService.processFile(filePath, file.mimetype);
    return { data };
  }
}
