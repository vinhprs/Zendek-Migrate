import { Injectable } from '@nestjs/common';
import { Api } from '../fetch/zendesk';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrganizationsService {
  DOMAIN: string = 'https://suzumlmhelp.zendesk.com/api/v2';
  DOMAIN_WOWI: string = "https://wowihelp.zendesk.com/api/v2";
  PATH: string = '/organizations';
  constructor(
    private readonly api: Api,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>
  ) {}

  async syncOrganizations()
  : Promise<Organization[]> {
      const data = await this.api.get(this.DOMAIN, this.PATH);
      const organizations : Organization[] = data.organizations;

      return await this.organizationRepository.save(organizations);
  }

  async migrate()
  : Promise<any> {
    const data = await this.organizationRepository.find({});
    const new_organizations = await this.new_organizations();

    const new_organization_names = new_organizations.map((organization) => organization.name);
    let filterData = data.filter((organization) => !new_organization_names.includes(organization.name));

    if (filterData.length > 0) {
      const request = JSON.parse(JSON.stringify({organizations: filterData}));
      await this.api.post(this.DOMAIN_WOWI, this.PATH + '/create_many', request);
    }

  }

  async old_organizations(): Promise<any> {
    const data = await this.api.get(this.DOMAIN, this.PATH);
    return data.organizations;
  }

  async new_organizations(): Promise<any> {
    const data = await this.api.get_new(this.DOMAIN_WOWI, this.PATH);
    return data.organizations;
  }

}
