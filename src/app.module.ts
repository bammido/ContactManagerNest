import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdapterModule } from './adapter/adapter.module';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { groupProviders } from './adapter/database/providers/groups.providers';
import { DatabaseModule } from './adapter/database/database.module';
import { databaseProviders } from './adapter/database/database.providers';
import { contactProviders } from './adapter/database/providers/contact.providers';
import { MulterModule } from '@nestjs/platform-express';
import { userProviders } from './adapter/database/providers/user.providers';

const envFilePath = path.resolve(__dirname, '../.env');

@Module({
  imports: [
    DatabaseModule,
    AdapterModule,
    ConfigModule.forRoot({
      envFilePath: envFilePath,
      isGlobal: true,
    }),
    MulterModule.register({ dest: './uploads' }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ...databaseProviders,
    ...groupProviders,
    ...contactProviders,
    ...userProviders,
  ],
})
export class AppModule {}
