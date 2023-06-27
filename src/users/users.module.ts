import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UsersController } from './users.controller';
import {HttpModule} from '@nestjs/axios';
import { Api } from '../fetch/zendesk';
import { CustomRolesModule } from '../custom-roles/custom-roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    HttpModule,
    CustomRolesModule
  ],
  providers: [UsersService, Api],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
