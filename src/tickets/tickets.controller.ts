import { Controller, Get, Query } from '@nestjs/common';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  // @Get()
  //   async syncUsers(): Promise<any> {
  //     await this.ticketsService.syncTicket();
  //   }

  @Get('todb')
    async sync(): Promise<any> {
      await this.ticketsService.sync();
    }

  @Get()
    async migrate(): Promise<any> {
      await this.ticketsService.migrate();
    }

  @Get('purge')
    async purge(@Query('ids') ids: number[] = null): Promise<any> {
      if (ids) {
        return await this.ticketsService.purge(ids);
      }
      return await this.ticketsService.purge();
    }

  @Get('purgerenume')
    async purgeRenume(@Query('page') page: number = 1): Promise<any> {
      return await this.ticketsService.purgeRenume(page);
    }

  @Get('syncsubject')
    async syncSubject(): Promise<any> {
      return await this.ticketsService.syncTicketBySubject();
    }

  @Get('importmissing')
    async importMissingTickets(): Promise<any> {
      return await this.ticketsService.importMissingTickets();
    }

}
