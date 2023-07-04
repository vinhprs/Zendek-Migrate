import { Controller, Get } from '@nestjs/common';
import { CustomRolesService } from './custom-roles.service';

@Controller('custom-roles')
export class CustomRolesController {
  constructor(private readonly customRolesService: CustomRolesService) {}

  @Get()
  async customRoles()
  : Promise<any> {
    return this.customRolesService.customRoles();
  }

  @Get('/migrate')
  async migrate() {
    return this.customRolesService.migrate();
  }

}
