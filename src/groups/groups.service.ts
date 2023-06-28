import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Api } from '../fetch/zendesk';
import { InjectRepository } from '@nestjs/typeorm';
import { Groups } from './entities/group.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GroupsService {
  DOMAIN: string = `https://${process.env.OLD_DOMAIN}.zendesk.com/api/v2`;
  DOMAIN_WOWI: string = `https://${process.env.NEW_DOMAIN}.zendesk.com/api/v2`;
  PATH: string = '/groups'
  constructor(
    private readonly api: Api,
    @InjectRepository(Groups)
    private readonly groupsRepository: Repository<Groups>
  ) {}

  async syncGroups()
  : Promise<Groups[]> {
    const data = await this.api.get(this.DOMAIN, this.PATH, process.env.OLD_ZENDESK_USERNAME, process.env.OLD_ZENDESK_USERNAME);
    const groups = data.groups;

    return await this.groupsRepository.save(groups);
  }

  async getOldGroups()
  : Promise<Groups[]> {
    return await this.groupsRepository.find({});
  }

  async getNewGroups()
  : Promise<Groups[]> {
    const data = await this.api.get(this.DOMAIN_WOWI, this.PATH, process.env.NEW_ZENDESK_USERNAME, process.env.NEW_ZENDESK_PASSWORD);
    return data.groups;
  }

  async migrate() 
  : Promise<any> {
    const data = await this.getOldGroups();
    for(const org of data ) {
      const request = JSON.parse(JSON.stringify({group: org}));
      await this.api.post(this.DOMAIN_WOWI, this.PATH, request, process.env.NEW_ZENDESK_USERNAME, process.env.NEW_ZENDESK_PASSWORD)
    }
  }
}
