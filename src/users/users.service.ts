import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import {join} from 'path';
import { Api } from '../fetch/zendesk';
import { Attachments } from 'src/attachments/entities/attachment.entity';
@Injectable()
export class UsersService {
    DOMAIN: string = 'https://suzumlmhelp.zendesk.com/api/v2';
    DOMAIN_WOWI: string = "https://wowihelp.zendesk.com/api/v2";
    PATH: string = '/users'
    constructor(
        @InjectRepository(User)
        private readonly UserRepository: Repository<User>,
        private readonly api: Api
    ) {}

    async syncUser()
    : Promise<any> {
        let currentPage = await this.api.get(this.DOMAIN, this.PATH);
        let i = 1;
        while(currentPage.next_page) {
            i++;
            const users: User[] = currentPage.users;
            currentPage = await this.api.get(this.DOMAIN, this.PATH + `?page=${i}`);
            for(const user of users) {
                const request = JSON.parse(JSON.stringify({user}))
                await this.api.post(this.DOMAIN_WOWI, this.PATH, request);
            }
            // await this.UserRepository.save(users);

        }
        const users: User[] = currentPage.users;
        // await this.UserRepository.save(users);
    }

    async migrate()
    : Promise<any> {
        const data = await this.UserRepository.find({});
        for(const user of data) {
            const request = JSON.parse(JSON.stringify({user}))
            await this.api.post(this.DOMAIN_WOWI, this.PATH, request);
        }
    }
}
