import { Injectable } from '@nestjs/common';
import { CreateLocaleDto } from './dto/create-locale.dto';
import { UpdateLocaleDto } from './dto/update-locale.dto';
import { Api } from '../fetch/zendesk';
import { InjectRepository } from '@nestjs/typeorm';
import { Locale } from './entities/locale.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocalesService {
  DOMAIN: string = `https://${process.env.OLD_DOMAIN}.zendesk.com/api/v2`;
  DOMAIN_WOWI: string = `https://${process.env.NEW_DOMAIN}.zendesk.com/api/v2`;
  PATH: string = '/locales';
  constructor(
    private readonly api: Api,
    @InjectRepository(Locale)
    private readonly localeRepository: Repository<Locale>
  ) {}

  async syncLocales()
  : Promise<Locale[]> {
    const data = await this.api.get(this.DOMAIN, this.PATH, process.env.OLD_ZENDESK_USERNAME, process.env.OLD_ZENDESK_PASSWORD);
    const locales= data.locales;

    return await this.localeRepository.save(locales);
  }

  async getOldLacales()
  : Promise<Locale[]> {
    return await this.localeRepository.find({});
  }

  async migrate()
  : Promise<any> {
    const data = await this.getOldLacales();
    for(const org of data ) {
      const request = JSON.parse(JSON.stringify({group: org}));
      await this.api.post(this.DOMAIN_WOWI, this.PATH, request, process.env.NEW_ZENDESK_USERNAME, process.env.NEW_ZENDESK_PASSWORD)
    }
  }

}
