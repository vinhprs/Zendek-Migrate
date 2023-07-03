import { Module } from '@nestjs/common';
import { TicketFieldService } from './ticket-field.service';
import { TicketFieldController } from './ticket-field.controller';
import { HttpModule } from '@nestjs/axios';
import { Api } from 'src/fetch/zendesk';

@Module({
  imports: [
    HttpModule
  ],
  controllers: [TicketFieldController],
  providers: [TicketFieldService, Api],
  exports: [TicketFieldService]
})
export class TicketFieldModule {}
