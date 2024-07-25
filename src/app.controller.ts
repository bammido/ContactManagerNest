import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Group } from './adapter/database/entities/group.entity';

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
    return groups
  }
}
