import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Api } from '../fetch/zendesk';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization]),
    HttpModule
  ],
  controllers: [OrganizationsController],
  providers: [OrganizationsService, Api],
  exports: [OrganizationsService]
})
export class OrganizationsModule {}
