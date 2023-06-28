import { Controller, Get } from '@nestjs/common';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
    async syncUsers(): Promise<any> {
      await this.ticketsService.syncTicket();
    }

  @Get('/migrate')
    async migrate(): Promise<any> {
      await this.ticketsService.migrate();
    }
}
