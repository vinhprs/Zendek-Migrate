import { Injectable } from '@nestjs/common';
import { Api } from '../fetch/zendesk';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrganizationsService {
  DOMAIN: string = `https://${process.env.OLD_DOMAIN}.zendesk.com/api/v2`;
  DOMAIN_WOWI: string = `https://${process.env.NEW_DOMAIN}.zendesk.com/api/v2`;
  PATH: string = '/organizations';
  constructor(
    private readonly api: Api,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>
  ) {}

  async syncOrganizations()
  : Promise<Organization[]> {
      const data = await this.api.get(this.DOMAIN, this.PATH, process.env.OLD_ZENDESK_USERNAME, process.env.OLD_ZENDESK_USERNAME);
      const organizations : Organization[] = data.organizations;

      return await this.organizationRepository.save(organizations);
  }

  async getOldOrg()
  : Promise<Organization[]> {
    return await this.organizationRepository.find({});
  }

  async getNewOrg()
  : Promise<Organization[]> {
    const data = await this.api.get(this.DOMAIN_WOWI, this.PATH, process.env.NEW_ZENDESK_USERNAME, process.env.NEW_ZENDESK_PASSWORD);
    return data.organizations;
  }

  async migrate()
  : Promise<any> {
    const data = await this.getOldOrg();

    const new_organizations = await this.getNewOrg();

    const new_organization_names = new_organizations.map((organization) => organization.name);
    let filterData = data.filter((organization) => !new_organization_names.includes(organization.name));
    let filterName = filterData.map((organization) => ({name: organization.name}));

    if (filterName.length > 0) {
      
      for (const org of filterName) {
        const request = JSON.parse(JSON.stringify({organization: org}));
        await this.api.post(this.DOMAIN_WOWI, this.PATH, request, process.env.NEW_ZENDESK_USERNAME, process.env.NEW_ZENDESK_PASSWORD);
      }
    }

  }

}
