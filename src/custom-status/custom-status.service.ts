import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Api } from 'src/fetch/zendesk';
import { Repository } from 'typeorm';
import { CustomStatus } from './entities/custom-status.entity';

@Injectable()
export class CustomStatusService {
  DOMAIN: string = `https://${process.env.OLD_DOMAIN}.zendesk.com/api/v2`;
  DOMAIN_WOWI: string = `https://${process.env.NEW_DOMAIN}.zendesk.com/api/v2`;
  PATH: string = '/custom_statuses';
  constructor(
    private readonly api: Api,
    @InjectRepository(CustomStatus)
    private readonly custom_statusesRepository: Repository<CustomStatus>
  ) {}

  async syncCustomStatus(): Promise<CustomStatus[]> {
    const data = await this.api.get(this.DOMAIN, this.PATH, process.env.OLD_ZENDESK_USERNAME, process.env.OLD_ZENDESK_PASSWORD);
    const custom_statuses : CustomStatus[] = data.custom_statuses;

    return await this.custom_statusesRepository.save(custom_statuses);
  }

  async migrate(): Promise<any> {
    const data = await this.custom_statusesRepository.find({});
    const new_custom_statuses = await this.new_custom_statuses();

    const new_custom_status_raw_agent_label = new_custom_statuses.map((custom_status: CustomStatus) => custom_status.raw_agent_label);
    const new_custom_status_agent_label = new_custom_statuses.map((custom_status: CustomStatus) => custom_status.agent_label);

    for (const customStatus of data) {
      if (new_custom_status_raw_agent_label.includes(customStatus.raw_agent_label) && new_custom_status_agent_label.includes(customStatus.agent_label)) continue;
      const request = JSON.parse(JSON.stringify({custom_statuses: customStatus}));
      await this.api.post(this.DOMAIN_WOWI, this.PATH, request, process.env.NEW_ZENDESK_USERNAME, process.env.NEW_ZENDESK_PASSWORD);
    }
  }

  async old_custom_statuses(): Promise<any> {
    const data = await this.api.get(this.DOMAIN, this.PATH, process.env.OLD_ZENDESK_USERNAME, process.env.OLD_ZENDESK_PASSWORD);
    return data.custom_statuses;
  }

  async new_custom_statuses(): Promise<any> {
    const data = await this.api.get(this.DOMAIN_WOWI, this.PATH, process.env.NEW_ZENDESK_USERNAME, process.env.NEW_ZENDESK_PASSWORD);
    return data.custom_statuses;
  }
}
