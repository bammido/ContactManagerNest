import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  Param,
  Put,
  Delete,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Group } from './adapter/database/entities/group.entity';
import { Contact } from './adapter/database/entities/contact.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/login')
  async login(
    @Body() body: { email: string; password: string },
    @Res() res: Response,
  ) {
    const token = await this.appService.login(body);

    if (!token) {
      res.status(404).send({ message: 'email ou senha incorreto' });
      return
    }

    res.status(200).send({ token });
  }

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

  @Post('/contacts')
  async postContact(
    @Body() body: { name: string; number: string; groupId: string },
  ): Promise<Contact> {
    const contact = await this.appService.createOneContact(body);
    return contact;
  }

  @Put('/contacts')
  async putContact(
    @Body() body: { name: string; number: string; groupId: string; id: string },
  ): Promise<Contact> {
    const contact = await this.appService.editOneContact(body);
    return contact;
  }

  @Delete('/contacts/:id')
  async deleteContact(@Param('id') id: string): Promise<Contact> {
    const contact = await this.appService.deleteOneContact(id);
    return contact;
  }

  @Post('/sendFile')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { groupId: string },
  ) {
    const filePath = file?.path;

    const contacts = await this.appService.processFile(filePath, file.mimetype);

    const insertedContacts = await this.appService.createManyContacts({
      contacts,
      groupId: body.groupId,
    });

    return insertedContacts;
  }
}
