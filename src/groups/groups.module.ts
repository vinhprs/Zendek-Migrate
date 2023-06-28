import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Groups } from './entities/group.entity';
import { HttpModule } from '@nestjs/axios';
import { Api } from '../fetch/zendesk';

@Module({
  imports: [
    TypeOrmModule.forFeature([Groups]),
    HttpModule
  ],
  controllers: [GroupsController],
  providers: [GroupsService, Api],
  exports: [GroupsService]
})
export class GroupsModule {}
