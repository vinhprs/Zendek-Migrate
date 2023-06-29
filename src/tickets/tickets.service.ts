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
        private readonly userService: UsersService
    ) {}

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
    }

    async getComments(ticketId: string): Promise<any> {
        try {
            return await this.api.get(this.DOMAIN, this.PATH + `/${ticketId}/comments`, process.env.OLD_ZENDESK_USERNAME, process.env.OLD_ZENDESK_PASSWORD);
        } catch (e) {
            log("Error getting comments", e);
            return {};
        }
    }

    splitTicket(tickets: Ticket[]): Ticket[][] {
        const chunkSize = 100;
        const totalChunks = Math.ceil(tickets.length / chunkSize);
        const chunks: Ticket[][] = [];

        for (let i = 0; i < totalChunks; i++) {
            const start = i * chunkSize;
            const end = start + chunkSize;
            const chunk = tickets.slice(start, end);
            chunks.push(chunk);
        }
        return chunks;
    }

    replaceObjectId(ticket: Ticket, old_content: string, new_content: string): Ticket {
        let StrTicket: string = JSON.stringify(ticket);
        StrTicket = StrTicket.replace(old_content, new_content);
        ticket = JSON.parse(StrTicket);

        return ticket;
    }

    async migrate(): Promise<any> {
        await this.importAll();
        // return "true";
        let currentPage = await this.api.get(this.DOMAIN, this.PATH, process.env.OLD_ZENDESK_USERNAME, process.env.OLD_ZENDESK_PASSWORD);
        let i = 0;
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
        while(currentPage.next_page) {
            i++;
            // const data: Ticket[] = currentPage.tickets;
            const data: any[] = currentPage.tickets;
            currentPage = await this.api.get(this.DOMAIN, this.PATH + `?page=${i}`, process.env.OLD_ZENDESK_USERNAME, process.env.OLD_ZENDESK_PASSWORD);
            
            // const old_brands: any[] = await this.brandService.old_brands();
            // const new_brands: any[] = await this.brandService.new_brands();

            const old_groups: any[] = await this.groupService.getOldGroups();
            const new_groups: any[] = await this.groupService.getNewGroups();

            const old_organizations: any[] = await this.organizationService.getOldOrg();
            const new_organizations: any[] = await this.organizationService.getNewOrg();

            const old_custom_statuses: any[] = await this.customStatusService.old_custom_statuses();
            const new_custom_statuses: any[] = await this.customStatusService.new_custom_statuses();

            const old_ticket_fields: any[] = await this.ticketFieldService.old_ticket_fields();
            const new_ticket_fields: any[] = await this.ticketFieldService.new_ticket_fields();

            for(var ticket of data) {

                const new_Ids: Array<number> = [];

                if (ticket.brand_id) {
                    // const old_brand = old_brands.find(brand => brand.id === ticket.brand_id);
                    // const new_brand = new_brands.find(brand => brand.name == old_brand.name);
                    ticket.brand_id = 11490025455513;
                }

                if (ticket.group_id) {
                    const old_group = old_groups.find(group => group.id == ticket.group_id);
                    const new_group = new_groups.find(group => group.name == old_group.name);                    
                    ticket.group_id = new_group.id;
                }

                if (ticket.organization_id) {
                    const old_organization = old_organizations.find(organization => organization.id === ticket.organization_id);
                    const new_organization = new_organizations.find(organization => organization.name == old_organization.name);
                    ticket.organization_id = new_organization.id;
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

                if (ticket.requester_id && !new_Ids.includes(ticket.requester_id)) {
                    const old_requester = await this.userService.getOldUser(ticket.requester_id);
                    const new_requester = await this.userService.searchNewUser(old_requester.email);

                    ticket = this.replaceObjectId(ticket, old_requester.id.toString(), new_requester.id.toString());

                    new_Ids.push(ticket.requester_id);
                }

                if (ticket.submitter_id && !new_Ids.includes(ticket.submitter_id)) {
                    const old_submitter = await this.userService.getOldUser(ticket.submitter_id);
                    const new_submitter = await this.userService.searchNewUser(old_submitter.email);

                    ticket = this.replaceObjectId(ticket, old_submitter.id.toString(), new_submitter.id.toString());

                    new_Ids.push(ticket.submitter_id);
                }

                if (ticket.assignee_id && !new_Ids.includes(ticket.assignee_id)) {
                    const old_assignee = await this.userService.getOldUser(ticket.assignee_id);
                    const new_assignee = await this.userService.searchNewUser(old_assignee.email);

                    ticket = this.replaceObjectId(ticket, old_assignee.id.toString(), new_assignee.id.toString());

                    new_Ids.push(ticket.assignee_id);
                }

                if (ticket.collaborator_ids.length > 0) {
                    for (const collaborator_id of ticket.collaborator_ids) {
                        if (new_Ids.includes(collaborator_id)) return;
                        const old_collaborator = await this.userService.getOldUser(collaborator_id);
                        const new_collaborator = await this.userService.searchNewUser(old_collaborator.email);

                        ticket = this.replaceObjectId(ticket, old_collaborator.id.toString(), new_collaborator.id.toString());

                        new_Ids.push(ticket.collaborator_id);
                    }
                }

                if (ticket.follower_ids.length > 0) {
                    for (const follower_id of ticket.follower_ids) {
                        if (new_Ids.includes(follower_id)) return;
                        const old_follower = await this.userService.getOldUser(follower_id);
                        const new_follower = await this.userService.searchNewUser(old_follower.email);

                        ticket = this.replaceObjectId(ticket, old_follower.id.toString(), new_follower.id.toString());

                        new_Ids.push(ticket.follower_id);
                    }
                }

                if (ticket.email_cc_ids.length > 0) {
                    for (const email_cc_id of ticket.email_cc_ids) {
                        if (new_Ids.includes(email_cc_id)) return;
                        const old_email_cc = await this.userService.getOldUser(email_cc_id);
                        const new_email_cc = await this.userService.searchNewUser(old_email_cc.email);

                        ticket = this.replaceObjectId(ticket, old_email_cc.id.toString(), new_email_cc.id.toString());

                        new_Ids.push(ticket.email_cc_id);
                }}

                // if (ticket.comments.length > 0) {
                //     for (const comment of ticket.comments) {
                //         if (new_Ids.includes(comment.author_id)) return;
                //         const old_comment = await this.userService.getOldUser(comment.author_id);
                //         const new_comment = await this.userService.searchNewUser(old_comment.email);

                //         ticket = this.replaceObjectId(ticket, old_comment.id.toString(), new_comment.id.toString());
                //     }
                // }

                // get ticket comments
                let comments: any = await this.getComments(ticket.id.toString());
                comments = (comments.comments as Array<any>).map(async (comment) =>
                    {
                        const old_author = await this.userService.getOldUser(comment.author_id);
                        let newAuthorId = (await this.userService.searchNewUser(old_author.email)).id;
                        return ({
                            author_id: newAuthorId,
                            created_at: comment.created_at,
                            value: comment.body
                        })
                    });
                ticket.comments = comments;

                // console.log(ticket);
                // writeFileSync(join(__dirname, '..', '..','logs', `${ticket.id}.json`), JSON.stringify(ticket));

                // const request = JSON.parse(JSON.stringify({ticket})).ticket;
                // let res = await this.api.post(this.DOMAIN_WOWI, '/imports/tickets', {
                //     "ticket": request
                // }, process.env.NEW_ZENDESK_USERNAME, process.env.NEW_ZENDESK_PASSWORD);

                // break;

                // if (res) {
                //     writeFileSync(join(__dirname, '..', '..', 'logs', `${ticket.id}_new.json`), JSON.stringify(res));
                // }
                // console.log(JSON.stringify(res));
                // break;
            }

            // return;

            let chunks: Ticket[][] = this.splitTicket(data); // split tickets into chunks of 50

            for (const chunk of chunks) {
                const request = JSON.parse(JSON.stringify({chunk})).chunk;
                await this.api.post(this.DOMAIN_WOWI, '/imports/tickets/create_many', {
                    "tickets": request
                }, process.env.NEW_ZENDESK_USERNAME, process.env.NEW_ZENDESK_PASSWORD);

                await delay(7000);
                // break;
            }
            // break;
        }
    }

}
