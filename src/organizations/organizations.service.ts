import { Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
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
    const request = JSON.parse(JSON.stringify({organizations: data}));
    await this.api.post(this.DOMAIN_WOWI, this.PATH + '/create_many', request);
  }
}
