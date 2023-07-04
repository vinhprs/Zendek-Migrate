import { Controller, Get } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { Groups } from './entities/group.entity';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  async syncGroups()
  : Promise<Groups[]> {
    return this.groupsService.syncGroups();
  }

  @Get('/migrate')
  async migrate()
  : Promise<any> {
    return this.groupsService.migrate();
  }
}
