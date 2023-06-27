import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomRolesService } from './custom-roles.service';
import { CreateCustomRoleDto } from './dto/create-custom-role.dto';
import { UpdateCustomRoleDto } from './dto/update-custom-role.dto';

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
