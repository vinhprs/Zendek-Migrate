import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { join } from 'path';
import { Api } from '../fetch/zendesk';
import { Attachments } from '../attachments/entities/attachment.entity';
import { CustomRolesService } from '../custom-roles/custom-roles.service';
import { GroupsService } from '../groups/groups.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { log } from 'console';
@Injectable()
export class UsersService {
    DOMAIN: string = `https://${process.env.OLD_DOMAIN}.zendesk.com/api/v2`;
    DOMAIN_WOWI: string = `https://${process.env.NEW_DOMAIN}.zendesk.com/api/v2`;
    PATH: string = '/users'
    constructor(
        @InjectRepository(User)
        private readonly UserRepository: Repository<User>,
        private readonly api: Api,
        private readonly customRolesService: CustomRolesService,
        private readonly groupsService: GroupsService,
        private readonly organizationService: OrganizationsService
    ) { }

    async syncUser()
        : Promise<any> {
        let currentPage = await this.api.get(this.DOMAIN, this.PATH, process.env.OLD_ZENDESK_USERNAME, process.env.OLD_ZENDESK_PASSWORD);
        let i = 1;
        while (currentPage.next_page) {
            i++;
            const users: User[] = currentPage.users;
            currentPage = await this.api.get(this.DOMAIN, this.PATH + `?page=${i}`, process.env.OLD_ZENDESK_USERNAME, process.env.OLD_ZENDESK_PASSWORD);
            for (const user of users) {
                const request = JSON.parse(JSON.stringify({ user }))
                await this.api.post(this.DOMAIN_WOWI, this.PATH, request, process.env.NEW_ZENDESK_USERNAME, process.env.NEW_ZENDESK_PASSWORD);
            }
            // await this.UserRepository.save(users);

    }
    const users: User[] = currentPage.users;
    // await this.UserRepository.save(users);
  }

    async migrate()
        : Promise<any> {
        const data = await this.UserRepository.find({});
        const [customRoles, oldGroups, oldOrg] = await Promise.all([
            this.customRolesService.customRoles(),
            this.groupsService.getOldGroups(),
            this.organizationService.getOldOrg()
        ]) 
        for (const user of data) {
            if (user.role_type) {
                const customRole = customRoles.find(role => role.role_type === user.role_type);
                user.custom_role_id = customRole.id;
            }
            if(user.default_group_id) {
                const newGroups = await this.groupsService.getNewGroups();
                const groups = oldGroups.find(group => group.id === user.default_group_id);
                const newGroupSync = newGroups.find(e => e.name === groups.name);
                user.default_group_id = newGroupSync.id;
            }
            if(user.organization_id) {
                const newOrg = await this.organizationService.getNewOrg();
                const org = oldOrg.find(e => e.id === user.organization_id);
                const newOrgSync = newOrg.find(e => e.name === org.name);
                user.organization_id = newOrgSync.id
            }
            const request = JSON.parse(JSON.stringify({ user }))
            await this.api.post(this.DOMAIN_WOWI, this.PATH, request, process.env.NEW_ZENDESK_USERNAME, process.env.NEW_ZENDESK_PASSWORD);
        }
    }

    async getOldUser(Id: string): Promise<User> {
        try {
            let res = await this.api.get(this.DOMAIN, this.PATH + `/${Id}`, process.env.OLD_ZENDESK_USERNAME, process.env.OLD_ZENDESK_PASSWORD);
            return res.user as User;
        } catch (e) {
            return null;
        }
    }

    async getNewUser(Id: string): Promise<User> {
        try {
            let res = await this.api.get(this.DOMAIN_WOWI, this.PATH + `/${Id}`, process.env.NEW_ZENDESK_USERNAME, process.env.NEW_ZENDESK_PASSWORD);
            return res.user as User;
        } catch (e) {
            return null;
        }
    }

    async searchNewUser(query: string): Promise<User> | null {
        try {
            let res = await this.api.get(this.DOMAIN_WOWI, this.PATH + `?query=${query}`, process.env.NEW_ZENDESK_USERNAME, process.env.NEW_ZENDESK_PASSWORD);
            return res.users[0] as User;
        } catch (e) {
            return null;
        }
    }

    async getOldAgents(): Promise<User[]> {
        const data = await this.api.get(this.DOMAIN, this.PATH + '?role[]=admin&role[]=agent', process.env.OLD_ZENDESK_USERNAME, process.env.OLD_ZENDESK_PASSWORD);
        return data.users;
    }

    async getNewAgents(): Promise<User[]> {
        const data = await this.api.get(this.DOMAIN_WOWI, this.PATH + '?role[]=admin&role[]=agent', process.env.NEW_ZENDESK_USERNAME, process.env.NEW_ZENDESK_PASSWORD);
        return data.users;
    }

}
