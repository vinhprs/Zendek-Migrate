import { Injectable } from '@nestjs/common';
import { Api } from '../fetch/zendesk';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TicketFieldService {
  DOMAIN: string = `https://${process.env.OLD_DOMAIN}.zendesk.com/api/v2`;
  DOMAIN_WOWI: string = `https://${process.env.NEW_DOMAIN}.zendesk.com/api/v2`;
  PATH: string = '/ticket_fields';
  constructor(
    private readonly api: Api,
  ) {}

  async syncTicketFields(): Promise<any> {
    const data = await this.api.get(this.DOMAIN, this.PATH, process.env.OLD_ZENDESK_USERNAME, process.env.OLD_ZENDESK_PASSWORD);
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
      await this.api.post(this.DOMAIN_WOWI, this.PATH, request, process.env.NEW_ZENDESK_USERNAME, process.env.NEW_ZENDESK_PASSWORD);
    }
  }

  async old_ticket_fields(): Promise<any> {
    const data = await this.api.get(this.DOMAIN, this.PATH, process.env.OLD_ZENDESK_USERNAME, process.env.OLD_ZENDESK_PASSWORD);
    return data.ticket_fields;
  }

  async new_ticket_fields(): Promise<any> {
    const data = await this.api.get(this.DOMAIN_WOWI, this.PATH, process.env.NEW_ZENDESK_USERNAME, process.env.NEW_ZENDESK_PASSWORD);
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