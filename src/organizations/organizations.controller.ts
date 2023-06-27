import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities/organization.entity';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  async syncOrganizations ()
  : Promise<Organization[]> {
    return this.organizationsService.syncOrganizations();
  }

  @Get('/migrate')
  async migrate()
  : Promise<any> {
    return this.organizationsService.migrate();
  }

}
