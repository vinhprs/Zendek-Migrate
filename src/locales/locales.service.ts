import { Injectable } from '@nestjs/common';
import { CreateLocaleDto } from './dto/create-locale.dto';
import { UpdateLocaleDto } from './dto/update-locale.dto';
import { Api } from '../fetch/zendesk';
import { InjectRepository } from '@nestjs/typeorm';
import { Locale } from './entities/locale.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocalesService {
  DOMAIN: string = 'https://suzumlmhelp.zendesk.com/api/v2';
  PATH: string = '/locales';
  constructor(
    private readonly api: Api,
    @InjectRepository(Locale)
    private readonly localeRepository: Repository<Locale>
  ) {}

  async syncLocales()
  : Promise<Locale[]> {
    const data = await this.api.get(this.DOMAIN, this.PATH);
    const locales= data.locales;

    return await this.localeRepository.save(locales);
  }
}
