import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Api } from '../fetch/zendesk';
import { InjectRepository } from '@nestjs/typeorm';
import { Groups } from './entities/group.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GroupsService {
  DOMAIN: string = 'https://suzumlmhelp.zendesk.com/api/v2';
  DOMAIN_WOWI: string = "https://wowihelp.zendesk.com/api/v2";
  PATH: string = '/groups'
  constructor(
    private readonly api: Api,
    @InjectRepository(Groups)
    private readonly groupsRepository: Repository<Groups>
  ) {}

  async syncGroups()
  : Promise<Groups[]> {
    const data = await this.api.get(this.DOMAIN, this.PATH);
    const groups = data.groups;

    return await this.groupsRepository.save(groups);
  }

  async migrate() 
  : Promise<any> {
    const data = await this.groupsRepository.find({});
    const new_groups = await this.new_groups();
    const new_group_names = new_groups.map((group) => group.name);

    for(const group of data) {

      if (!new_group_names.includes(group.name)) {
        const request = JSON.parse(JSON.stringify({group: {
          name: group.name,
        }}));
        await this.api.post(this.DOMAIN_WOWI, this.PATH, request)
      }

    }
  }

  async old_groups(): Promise<any> {
    const data = await this.api.get(this.DOMAIN, this.PATH);
    return data.groups;
  }

  async new_groups(): Promise<any> {
    const data = await this.api.get_new(this.DOMAIN_WOWI, this.PATH);
    return data.groups;
  }
}
