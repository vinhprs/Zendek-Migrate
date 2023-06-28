import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { Api } from 'src/fetch/zendesk';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './ticket.entity';
import { HttpModule } from '@nestjs/axios';
import { BrandModule } from 'src/brand/brand.module';
import { CustomStatusModule } from 'src/custom-status/custom-status.module';
import { GroupsModule } from 'src/groups/groups.module';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { TicketFieldModule } from 'src/ticket-field/ticket-field.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket]),
    HttpModule,
    BrandModule,
    CustomStatusModule,
    GroupsModule,
    OrganizationsModule,
    TicketFieldModule
  ],
  controllers: [TicketsController],
  providers: [TicketsService, Api],
  exports: [TicketsService],
})
export class TicketsModule {}
