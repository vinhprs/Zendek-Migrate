import { Controller, Get, Query } from '@nestjs/common';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get('/migrate')
    async migrate(): Promise<any> {
      await this.ticketsService.migrate();
    }
}
