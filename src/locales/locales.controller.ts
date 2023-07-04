import { Controller, Get } from '@nestjs/common';
import { LocalesService } from './locales.service';
import { Locale } from './entities/locale.entity';

@Controller('locales')
export class LocalesController {
  constructor(private readonly localesService: LocalesService) {}

  @Get()
  async syncLocales()
  : Promise<Locale[]> {
    return this.localesService.syncLocales();
  }

  @Get('/migrate')
  async migrate()
  : Promise<Locale[]> {
    return this.localesService.migrate();
  }

}
