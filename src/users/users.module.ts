import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UsersController } from './users.controller';
import {HttpModule} from '@nestjs/axios';
import { Api } from '../fetch/zendesk';
import { CustomRolesModule } from '../custom-roles/custom-roles.module';
import { GroupsModule } from '../groups/groups.module';
import { OrganizationsModule } from '../organizations/organizations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    HttpModule,
    CustomRolesModule,
    GroupsModule,
    OrganizationsModule
  ],
  providers: [UsersService, Api],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
