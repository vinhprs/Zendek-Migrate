import { Module } from '@nestjs/common';
import { LocalesService } from './locales.service';
import { LocalesController } from './locales.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Locale } from './entities/locale.entity';
import { Api } from 'src/fetch/zendesk';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Locale])
  ],
  controllers: [LocalesController],
  providers: [LocalesService, Api]
})
export class LocalesModule {}
