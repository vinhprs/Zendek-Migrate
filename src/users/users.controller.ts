import { Controller, Get } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}


    @Get()
    async syncUsers()
    : Promise<any> {
        await this.usersService.syncUser();
    }

    @Get('/migrate')
    async migrate()
    : Promise<any> {
        return this.usersService.syncUser();
    }
}