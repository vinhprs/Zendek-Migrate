import { Injectable } from '@nestjs/common';
import { Ticket } from './ticket.entity';
import { Api } from 'src/fetch/zendesk';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandService } from 'src/brand/brand.service';
import { GroupsService } from 'src/groups/groups.service';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { CustomStatusService } from 'src/custom-status/custom-status.service';
import { TicketFieldService } from 'src/ticket-field/ticket-field.service';
import { log } from 'console';
import { UsersService } from 'src/users/users.service';
import { appendFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { ViewsService } from 'src/views/views.service';
import { User } from 'src/users/users.entity';
@Injectable()
export class TicketsService {
    DOMAIN: string = `https://${process.env.OLD_DOMAIN}.zendesk.com/api/v2`;
    DOMAIN_WOWI: string = `https://${process.env.NEW_DOMAIN}.zendesk.com/api/v2`;
    PATH: string = '/tickets'
    constructor(
        @InjectRepository(Ticket)
        private readonly TicketRepository: Repository<Ticket>,
        private readonly api: Api,
        private readonly brandService: BrandService,
        private readonly groupService: GroupsService,
        private readonly organizationService: OrganizationsService,
        private readonly customStatusService: CustomStatusService,
        private readonly ticketFieldService: TicketFieldService,
        private readonly userService: UsersService,
        private readonly viewService: ViewsService
    ) {}

    async sync(): Promise<any> {
        let currentPage = await this.api.get(this.DOMAIN, this.PATH, process.env.OLD_ZENDESK_USERNAME, process.env.OLD_ZENDESK_PASSWORD);
        let i = 0;
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        while(currentPage.next_page) {
            i++;
            const tickets: Ticket[] = currentPage.tickets;
            log(JSON.stringify(tickets[0]))
            currentPage = await this.api.get(this.DOMAIN, this.PATH + `?page=${i}`, process.env.OLD_ZENDESK_USERNAME, process.env.OLD_ZENDESK_PASSWORD);
            // await this.TicketRepository.save(tickets);
            await this.TicketRepository
            .createQueryBuilder()
            .insert()
            .into(Ticket)
            .values(tickets)
            .orIgnore()
            .execute();
        }
    }
    /**
     * Imports all data from various services. Everything else must be imported before tickets can be imported.
     *
     * @return {Promise<any>} - A promise that resolves when all data is imported.
     */
    async importAll(): Promise<any> {
        await this.brandService.migrate();
        log('Imported brand');
        await this.groupService.migrate();
        log('Imported group');
        await this.organizationService.migrate();
        log('Imported organization');
        await this.customStatusService.migrate();
        log('Imported custom status');
        await this.ticketFieldService.migrate();
        log('Imported ticket field');
        await this.viewService.migrate();
        log('Imported view');
    }

    async getComments(ticketId: string): Promise<any> {
        try {
            return await this.api.get(this.DOMAIN, this.PATH + `/${ticketId}/comments`, process.env.OLD_ZENDESK_USERNAME, process.env.OLD_ZENDESK_PASSWORD);
        } catch (e) {
            log("Error getting comments", e);
            return {};
        }
    }

    mappingID(oldId: string, oldAgents: User[], newAgents: User[]): User {
        const mapping = {
            'emi-support@suzumlm.com': 'amanda-support@natureforex.com',
            'george@suzuverse.com': 'george@bluebelt.asia',
            'hirotaka@suzuverse.com': 'luis@suzuverse.jp',
            'luis@renume.jp': 'luis@suzuverse.jp',
            'support@suzumlm.com': 'luis@suzuverse.jp',
            'tsuyoshi.orikasa@suzu.company': 'luis@suzuverse.jp',
            'taguchi@renume.jp': 'luis@suzuverse.jp',
        }

        try {
            const oldAgent: User = oldAgents.find((agent: User) => agent.id.toString() == oldId);
            console.log(oldAgent.email);
            const newMatchingAgent = newAgents.find((agent: User) => agent.email == mapping[oldAgent.email]);
    
            if (newMatchingAgent) {
                return newMatchingAgent;
            } else {
                //return default agent
                return newAgents[0];
            }
        } catch (e) {
            log("ID doesnt match new agent:", oldId);
            return newAgents[0];
        }
    }

    splitTicket(tickets: any[]): any[][] {
        const chunkSize = 100;
        const totalChunks = Math.ceil(tickets.length / chunkSize);
        let chunks: any[][] = [];

        for (let i = 0; i < totalChunks; i++) {
            const start = i * chunkSize;
            const end = start + chunkSize;
            const chunk = tickets.slice(start, end);
            chunks.push(chunk);
        }
        return chunks;
    }

    splitIds(ids: string[]): string[][] {
        const chunkSize = 100;
        const totalChunks = Math.ceil(ids.length / chunkSize);
        const chunks: string[][] = [];

        for (let i = 0; i < totalChunks; i++) {
            const start = i * chunkSize;
            const end = start + chunkSize;
            const chunk = ids.slice(start, end);
            chunks.push(chunk);
        }

        return chunks;
    }

    findUser(Id: number, crawledUsers: User[]): User {
        try {
            return crawledUsers.find((user: User) => user.id == Id);
        } catch {
            return null;
        }
    }

    async saveDone(tickets: any[]): Promise<any> {

        let allTicketIds: string = '';
        for (const ticket of tickets) {
            allTicketIds += ticket.id + "\n";
        }

        appendFileSync(join(__dirname, '..', '..', 'logs', 'importedTicket_oldIds.txt'), allTicketIds);
    }

    async readDone(): Promise<string[]> {
        try {
            return readFileSync(join(__dirname, '..', '..', 'logs', 'importedTicket_oldIds.txt'), 'utf8').toString().split('\n');
        } catch (e) {
            return [''];
        }
    }

    async migrate(): Promise<any> {
        await this.importAll();
        // return "true";
        let currentPage = await this.api.get(this.DOMAIN, '/incremental/tickets.json?start_time=1325557721&per_page=100', process.env.OLD_ZENDESK_USERNAME, process.env.OLD_ZENDESK_PASSWORD);
        let i = 0;
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        // const old_brands: any[] = await this.brandService.old_brands();
        // const new_brands: any[] = await this.brandService.new_brands();

        // const old_groups: any[] = await this.groupService.getOldGroups();
        // const new_groups: any[] = await this.groupService.getNewGroups();

        let crawledOldUsers: User[] = [];
        let crawledNewUsers: User[] = [];

        const old_organizations: any[] = await this.organizationService.getOldOrg();
        const new_organizations: any[] = await this.organizationService.getNewOrg();

        const old_custom_statuses: any[] = await this.customStatusService.old_custom_statuses();
        const new_custom_statuses: any[] = await this.customStatusService.new_custom_statuses();

        const old_ticket_fields: any[] = await this.ticketFieldService.old_ticket_fields();
        const new_ticket_fields: any[] = await this.ticketFieldService.new_ticket_fields();

        const old_agents = await this.userService.getOldAgents();
        const new_agents = await this.userService.getNewAgents();

        while(!currentPage.end_of_stream) {
            i++;
            log("Processing page: " + i);
            let data: any[] = currentPage.tickets;
            let modified_ticket_ids: number[] = [];
            currentPage = await this.api.get(this.DOMAIN, `/incremental/tickets.json?start_time=${currentPage.end_time}&per_page=100`, process.env.OLD_ZENDESK_USERNAME, process.env.OLD_ZENDESK_PASSWORD);
            
            const done = await this.readDone();

            for(var ticket of data) {
                log("Processing ticket: ", ticket.id);
                try {
                    if (done.includes(ticket.id.toString())) {
                        log("Already done", ticket.id);
                        continue;
                    }

                    if (ticket.status == "deleted") {
                        log("Deleted ticket", ticket.id);
                        continue;
                    };

                    if (ticket.brand_id) {
                        ticket.brand_id = 11490025455513;
                    }
                    ticket.group_id = 20168083520281;

                    if (ticket.organization_id != null) {
                        try {
                            const old_organization = old_organizations.find(organization => organization.id === ticket.organization_id);
                            const new_organization = new_organizations.find(organization => organization.name == old_organization.name);
    
                            ticket.organization_id = new_organization.id;
                        } catch {
                            ticket.organization_id = null;
                        }
                    }

                    if (ticket.custom_status_id) {
                        const old_custom_status = old_custom_statuses.find(custom_status => custom_status.id === ticket.custom_status_id);
                        const new_custom_status = new_custom_statuses.find(custom_status => custom_status.raw_agent_label == old_custom_status.raw_agent_label && custom_status.raw_agent_label == old_custom_status.raw_agent_label);
                        ticket.custom_status_id = new_custom_status.id;
                    }

                    if (ticket.custom_fields) {
                        for (const ticket_field of ticket.custom_fields) {
                            const old_ticket_field = old_ticket_fields.find(ticket_field => ticket_field.id === ticket_field.id);
                            const new_ticket_field = new_ticket_fields.find(ticket_field => ticket_field.name == old_ticket_field.name);
                            ticket_field.id = new_ticket_field.id;
                        }
                    }

                    if (ticket.requester_id) {

                        let old_requester = this.findUser(ticket.requester_id, crawledOldUsers);
                        if (!old_requester) {
                            old_requester = await this.userService.getOldUser(ticket.requester_id);
                            crawledOldUsers.push(old_requester);
                        };

                        let new_requester = this.findUser(ticket.requester_id, crawledNewUsers);
                        if (!new_requester) {
                            new_requester = await this.userService.searchNewUser(old_requester.email);
                            crawledNewUsers.push(new_requester);
                        }

                        if (!new_requester) {
                            log("New requester not found!");
                            console.log(old_requester.email);
                            new_requester = this.mappingID(ticket.requester_id, old_agents, new_agents);
                        };

                        log("new requester", new_requester.email);
                        ticket.requester_id = new_requester.id;
                    }


                    if (ticket.submitter_id) {

                        let old_submitter = this.findUser(ticket.submitter_id, crawledOldUsers);
                        if (!old_submitter) {
                            old_submitter = await this.userService.getOldUser(ticket.submitter_id);
                            crawledOldUsers.push(old_submitter);
                        }

                        let new_submitter = this.findUser(ticket.submitter_id, crawledNewUsers);
                        if (!new_submitter) {
                            new_submitter = await this.userService.searchNewUser(old_submitter.email);
                            crawledNewUsers.push(new_submitter);
                        }

                        if (!new_submitter) {
                            new_submitter = this.mappingID(ticket.submitter_id, old_agents, new_agents);
                        }
                        ticket.submitter_id = new_submitter.id;
                    }

                    if (ticket.assignee_id) {
                        let old_assignee = this.findUser(ticket.assignee_id, crawledOldUsers);
                        if (!old_assignee) {
                            old_assignee = await this.userService.getOldUser(ticket.assignee_id);
                            crawledOldUsers.push(old_assignee);
                        }

                        let new_assignee = this.findUser(ticket.assignee_id, crawledNewUsers);
                        if (!new_assignee) {
                            new_assignee = await this.userService.searchNewUser(old_assignee.email);
                            crawledNewUsers.push(new_assignee);
                        }

                        if (!new_assignee) {
                            new_assignee = this.mappingID(ticket.assignee_id, old_agents, new_agents);
                        }
                        ticket.assignee_id = new_assignee.id;
                    }

                    if (ticket.collaborator_ids.length > 0) {
                        for (const collaborator_id of ticket.collaborator_ids) {

                            let old_collaborator = this.findUser(collaborator_id, crawledOldUsers);
                            if (!old_collaborator) {
                                old_collaborator = await this.userService.getOldUser(collaborator_id);
                                crawledOldUsers.push(old_collaborator);
                            }

                            let new_collaborator = this.findUser(collaborator_id, crawledNewUsers);
                            if (!new_collaborator) {
                                new_collaborator = await this.userService.searchNewUser(old_collaborator.email);
                                crawledNewUsers.push(new_collaborator);
                            }

                            if (!new_collaborator) {
                                new_collaborator = this.mappingID(collaborator_id, old_agents, new_agents);
                            }
                            ticket.collaborator_ids[ticket.collaborator_ids.indexOf(collaborator_id)] = new_collaborator.id;
                        }
                    }

                    if (ticket.follower_ids.length > 0) {
                        for (const follower_id of ticket.follower_ids) {

                            let old_follower = this.findUser(follower_id, crawledOldUsers);
                            if (!old_follower) {
                                old_follower = await this.userService.getOldUser(follower_id);
                                crawledOldUsers.push(old_follower);
                            }

                            let new_follower = this.findUser(follower_id, crawledNewUsers);
                            if (!new_follower) {
                                new_follower = await this.userService.searchNewUser(old_follower.email);
                                crawledNewUsers.push(new_follower);
                            }

                            if (!new_follower) {
                                new_follower = this.mappingID(follower_id, old_agents, new_agents);
                            }
                            ticket.follower_ids[ticket.follower_ids.indexOf(follower_id)] = new_follower.id;
                        }
                    }

                    if (ticket.email_cc_ids.length > 0) {
                        for (const email_cc_id of ticket.email_cc_ids) {

                            let old_email_cc = this.findUser(email_cc_id, crawledOldUsers);
                            if (!old_email_cc) {
                                old_email_cc = await this.userService.getOldUser(email_cc_id);
                                crawledOldUsers.push(old_email_cc);
                            }

                            let new_email_cc = this.findUser(email_cc_id, crawledNewUsers);
                            if (!new_email_cc) {
                                new_email_cc = await this.userService.searchNewUser(old_email_cc.email);
                                crawledNewUsers.push(new_email_cc);
                            }
                            
                            if (!new_email_cc) {
                                new_email_cc = this.mappingID(email_cc_id, old_agents, new_agents);
                            }
                            ticket.email_cc_ids[ticket.email_cc_ids.indexOf(email_cc_id)] = new_email_cc.id;
                    }}

                    // get ticket comments
                    let comments: any = await this.getComments(ticket.id.toString());
                    let new_comments = (comments.comments as Array<any>).map(async (comment) =>
                        {

                            let old_author = this.findUser(comment.author_id, crawledOldUsers);
                            if (!old_author) {
                                old_author = await this.userService.getOldUser(comment.author_id);
                                crawledOldUsers.push(old_author);
                            }

                            let new_author = this.findUser(comment.author_id, crawledNewUsers);
                            if (!new_author) {
                                new_author = await this.userService.searchNewUser(old_author.email);
                                crawledNewUsers.push(new_author);
                            }
                            
                            if (!new_author) {
                                new_author = this.mappingID(comment.author_id, old_agents, new_agents);
                            }

                            let newAuthorId = new_author.id;

                            return ({
                                author_id: newAuthorId,
                                created_at: comment.created_at,
                                value: comment.body
                            })

                        })

                    ticket.comments = await Promise.all(new_comments);
                    delete ticket.url;
                    
                    modified_ticket_ids.push(ticket.id);
                    continue;
                } catch (e) {
                    console.log(e);
                    continue;
                }
            }

            data = data.filter((ticket) => {
                return !done.includes(ticket.id.toString()) && modified_ticket_ids.includes(ticket.id);
            })

            log("[INFO]:: Prepared ", data.length, " tickets");

            let chunks: any[][] = this.splitTicket(data); // split tickets into chunks of 100

            for (const chunk of chunks) {
                try {
                    const request = JSON.parse(JSON.stringify({chunk})).chunk;
                    let res = await this.api.post(this.DOMAIN_WOWI, '/imports/tickets/create_many', {
                        "tickets": request
                    }, process.env.NEW_ZENDESK_USERNAME, process.env.NEW_ZENDESK_PASSWORD);
    
                    appendFileSync(join(__dirname, '..', '..', 'logs', 'importedTicket.txt'), JSON.stringify(res) + '\n');
                    this.saveDone(JSON.parse(JSON.stringify({chunk})).chunk);

                } catch (e) {
                    console.log(e);
                    continue
                }
            }
        }

        log("Done importing");
    }
}
