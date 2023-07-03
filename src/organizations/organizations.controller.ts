import { Controller, Get } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
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
