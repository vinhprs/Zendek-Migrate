import { Injectable } from '@nestjs/common';
import { Api } from '../fetch/zendesk';
import { InjectRepository } from '@nestjs/typeorm';
import { Groups } from './entities/group.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/users.entity';
import { log } from 'console';

@Injectable()
export class GroupsService {
  DOMAIN: string = `https://${process.env.OLD_DOMAIN}.zendesk.com/api/v2`;
  DOMAIN_WOWI: string = `https://${process.env.NEW_DOMAIN}.zendesk.com/api/v2`;
  PATH: string = '/groups'
  constructor(
    private readonly api: Api,
    @InjectRepository(Groups)
    private readonly groupsRepository: Repository<Groups>,
  ) {}

  async syncGroups()
  : Promise<Groups[]> {
    const data = await this.api.get(this.DOMAIN, this.PATH, process.env.OLD_ZENDESK_USERNAME, process.env.OLD_ZENDESK_USERNAME);
    const groups = data.groups;

    return await this.groupsRepository.save(groups);
  }

  async getOldGroups()
  : Promise<Groups[]> {
    // return await this.groupsRepository.find({});
    const data = await this.api.get(this.DOMAIN, this.PATH, process.env.OLD_ZENDESK_USERNAME, process.env.OLD_ZENDESK_PASSWORD);
    return data.groups;
  }

  async getNewGroups()
  : Promise<Groups[]> {
    const data = await this.api.get(this.DOMAIN_WOWI, this.PATH, process.env.NEW_ZENDESK_USERNAME, process.env.NEW_ZENDESK_PASSWORD);
    return data.groups;
  }

  async getOldGroupMembers() {
    let data = await this.api.get(this.DOMAIN, `/group_memberships/`, process.env.OLD_ZENDESK_USERNAME, process.env.OLD_ZENDESK_PASSWORD);
    let group_memberships = data.group_memberships;

    while(data.next_page) {
      group_memberships = group_memberships.concat(data.group_memberships);
      data = await this.api.get(this.DOMAIN, `/group_memberships/`, process.env.OLD_ZENDESK_USERNAME, process.env.OLD_ZENDESK_PASSWORD);
    }
    return group_memberships;
  }

  async getNewGroupMembers() {
    let data = await this.api.get(this.DOMAIN_WOWI, `/group_memberships/`, process.env.NEW_ZENDESK_USERNAME, process.env.NEW_ZENDESK_PASSWORD);
    let group_memberships = data.group_memberships;

    while(data.next_page) {
      group_memberships = group_memberships.concat(data.group_memberships);
      data = await this.api.get(this.DOMAIN_WOWI, `/group_memberships/`, process.env.NEW_ZENDESK_USERNAME, process.env.NEW_ZENDESK_PASSWORD);
    }

    return group_memberships;
  }

  async addUserToNewGroup(user_id: number, group_id: number) {
    const request = JSON.parse(JSON.stringify({
        group_membership: {user_id: user_id, group_id: group_id}
      }));
    return await this.api.post(this.DOMAIN_WOWI, this.PATH, request, process.env.NEW_ZENDESK_USERNAME, process.env.NEW_ZENDESK_PASSWORD);
  }

  async migrate() 
  : Promise<any> {
    const data = await this.getOldGroups();
    const new_groups = await this.getNewGroups();

    const new_group_names = new_groups.map((group) => group.name);
    for(const group of data) {
      if (!new_group_names.includes(group.name)) {
        const request = JSON.parse(JSON.stringify({group: group}));
        await this.api.post(this.DOMAIN_WOWI, this.PATH, request, process.env.NEW_ZENDESK_USERNAME, process.env.NEW_ZENDESK_PASSWORD)
      };
    }
  }
}
