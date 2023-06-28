import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Api } from 'src/fetch/zendesk';
import { Repository } from 'typeorm';
import { CustomStatus } from './entities/custom-status.entity';

@Injectable()
export class CustomStatusService {
  DOMAIN: string = 'https://suzumlmhelp.zendesk.com/api/v2';
  DOMAIN_WOWI: string = "https://wowihelp.zendesk.com/api/v2";
  PATH: string = '/custom_statuses';
  constructor(
    private readonly api: Api,
    @InjectRepository(CustomStatus)
    private readonly custom_statusesRepository: Repository<CustomStatus>
  ) {}

  async syncCustomStatus(): Promise<CustomStatus[]> {
    const data = await this.api.get(this.DOMAIN, this.PATH);
    const custom_statuses : CustomStatus[] = data.custom_statuses;

    return await this.custom_statusesRepository.save(custom_statuses);
  }

  async migrate(): Promise<any> {
    const data = await this.custom_statusesRepository.find({});

    for (const customStatus of data) {
      const request = JSON.parse(JSON.stringify({custom_statuses: customStatus}));
      await this.api.post(this.DOMAIN_WOWI, this.PATH, request);
    }
  }

  async old_custom_statuses(): Promise<any> {
    const data = await this.api.get(this.DOMAIN, this.PATH);
    return data.custom_statuses;
  }

  async new_custom_statuses(): Promise<any> {
    const data = await this.api.get_new(this.DOMAIN_WOWI, this.PATH);
    return data.custom_statuses;
  }
}
