import { Injectable } from '@nestjs/common';
import { Api } from '../fetch/zendesk';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TicketFieldService {
  DOMAIN: string = 'https://suzumlmhelp.zendesk.com/api/v2';
  DOMAIN_WOWI: string = "https://wowihelp.zendesk.com/api/v2";
  PATH: string = '/ticket_fields';
  constructor(
    private readonly api: Api,
  ) {}

  async syncTicketFields(): Promise<any> {
    const data = await this.api.get(this.DOMAIN, this.PATH);
    return data.ticket_fields;
  }

  async migrate(): Promise<any> {
    const data = await this.syncTicketFields();
    const new_ticket_fields = await this.new_ticket_fields();

    const new_field_names = new_ticket_fields.map((field) => field.name);

    for (const field of data) {
      if (new_field_names.includes(field.name)) continue;
      let clearedField = this.clear(field);
      const request = JSON.parse(JSON.stringify({ticket_field: clearedField}));
      await this.api.post(this.DOMAIN_WOWI, this.PATH, request);
    }
  }

  async old_ticket_fields(): Promise<any> {
    const data = await this.api.get(this.DOMAIN, this.PATH);
    return data.ticket_fields;
  }

  async new_ticket_fields(): Promise<any> {
    const data = await this.api.get_new(this.DOMAIN_WOWI, this.PATH);
    return data.ticket_fields;
  }

  clear(ticketField: any): any {
    delete ticketField.id;
    delete ticketField.created_at;
    delete ticketField.updated_at;
    delete ticketField.url;
    delete ticketField.position;

    return ticketField;
  }

}