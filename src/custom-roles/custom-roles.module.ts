import { Module } from '@nestjs/common';
import { CustomRolesService } from './custom-roles.service';
import { CustomRolesController } from './custom-roles.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomRole } from './entities/custom-role.entity';
import { Api } from '../fetch/zendesk';

@Module({
  imports: [
    HttpModule,
  ],
  controllers: [CustomRolesController],
  providers: [CustomRolesService, Api],
  exports: [CustomRolesService]
})
export class CustomRolesModule {}
