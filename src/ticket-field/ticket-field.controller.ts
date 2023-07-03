import { Controller } from '@nestjs/common';
import { TicketFieldService } from './ticket-field.service';

@Controller('ticket-field')
export class TicketFieldController {
  constructor(private readonly ticketFieldService: TicketFieldService) {}
}
