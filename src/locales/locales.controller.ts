import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LocalesService } from './locales.service';
import { CreateLocaleDto } from './dto/create-locale.dto';
import { UpdateLocaleDto } from './dto/update-locale.dto';
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
