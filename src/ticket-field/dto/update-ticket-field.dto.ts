import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketFieldDto } from './create-ticket-field.dto';

export class UpdateTicketFieldDto extends PartialType(CreateTicketFieldDto) {}
