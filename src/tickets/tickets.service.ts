import { Injectable } from '@nestjs/common';
import { Ticket } from './ticket.entity';
import { Api } from 'src/fetch/zendesk';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class TicketsService {
  DOMAIN: string = 'https://suzumlmhelp.zendesk.com/api/v2';
    PATH: string = '/incremental/tickets/cursor'
    constructor(
        @InjectRepository(Ticket)
        private readonly TicketRepository: Repository<Ticket>,
        private readonly api: Api
    ) {}

    async syncTicket() {
        let currentPage = await this.api.get(this.DOMAIN, this.PATH + `?start_time=1332034771`);
        while(currentPage.after_url) {
            // i++;
            const tickets: Ticket[] = currentPage.tickets;
            // currentPage = await this.api.get(this.DOMAIN, this.PATH + `?page=${i}`);
            currentPage = await this.api.get(currentPage.after_url, "");
            await this.TicketRepository.save(tickets);
        }
        const tickets: Ticket[] = currentPage.tickets;
        await this.TicketRepository.save(tickets);
    }
}
