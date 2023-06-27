import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { Api } from 'src/fetch/zendesk';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './ticket.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket]),
    HttpModule
  ],
  controllers: [TicketsController],
  providers: [TicketsService, Api],
  exports: [TicketsService],
})
export class TicketsModule {}
