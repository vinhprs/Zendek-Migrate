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
import axios from 'axios';
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
        private readonly ticketFieldService: TicketFieldService
    ) {}

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
        return await this.api.get(this.DOMAIN, this.PATH + `/${ticketId}/comments`, process.env.OLD_ZENDESK_USERNAME, process.env.OLD_ZENDESK_PASSWORD);
    }

    splitTicket(tickets: Ticket[]): Ticket[][] {
        const chunkSize = 20;
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

    async migrate(): Promise<any> {
        await this.importAll();
        let currentPage = await this.api.get(this.DOMAIN, this.PATH, process.env.OLD_ZENDESK_USERNAME, process.env.OLD_ZENDESK_PASSWORD);
        let i = 0;
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
        while(currentPage.next_page) {
            i++;
            const data: Ticket[] = currentPage.tickets;
            currentPage = await this.api.get(this.DOMAIN, this.PATH + `?page=${i}`, process.env.OLD_ZENDESK_USERNAME, process.env.OLD_ZENDESK_PASSWORD);
            
            const old_brands: any[] = await this.brandService.old_brands();
            const new_brands: any[] = await this.brandService.new_brands();

            const old_groups: any[] = await this.groupService.getOldGroups();
            const new_groups: any[] = await this.groupService.getNewGroups();

            const old_organizations: any[] = await this.organizationService.getOldOrg();
            const new_organizations: any[] = await this.organizationService.getNewOrg();

            const old_custom_statuses: any[] = await this.customStatusService.old_custom_statuses();
            const new_custom_statuses: any[] = await this.customStatusService.new_custom_statuses();

            const old_ticket_fields: any[] = await this.ticketFieldService.old_ticket_fields();
            const new_ticket_fields: any[] = await this.ticketFieldService.new_ticket_fields();

            for(const ticket of data) {
                if (ticket.brand_id) {
                    const old_brand = old_brands.find(brand => brand.id === ticket.brand_id);
                    const new_brand = new_brands.find(brand => brand.name == old_brand.name);
                    ticket.brand_id = new_brand.id;
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

                // get ticket comments
                let comments: any = await this.getComments(ticket.id.toString());
                comments = (comments.comments as Array<any>).map(comment => ({
                    author_id: comment.author_id,
                    created_at: comment.created_at,
                    value: comment.body
                }));
                ticket.comments = comments;

            }

            let chunks: Ticket[][] = this.splitTicket(data); // split tickets into chunks of 50

            for (const chunk of chunks) {
                const request = JSON.parse(JSON.stringify({chunk})).chunk;
                await this.api.post(this.DOMAIN_WOWI, '/imports/tickets/create_many', {
                    "tickets": request
                }, process.env.NEW_ZENDESK_USERNAME, process.env.NEW_ZENDESK_PASSWORD);

                // log(request);
                // try {
                //     await axios({
                //         method: 'post',
                //         headers: {
                //             'Content-Type': 'application/json',
                //         },        
                //         url: `https://discord.com/api/webhooks/1123515476295811152/5v_RD4c9vnX6F4SPqr9_YBgVnX3cHpsLL09uiwMVpCEja0cJZdNxpFqSiLrCHeSlXh26`,
                //         data: JSON.stringify({
                //             content: JSON.stringify(request)
                //         })
                //     })
                // } catch (error) {
                //     console.log(error.message);
                // }

                await delay(7000);
                break;
            }
            break;
        }
    }

}
