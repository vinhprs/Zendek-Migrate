import { Module } from '@nestjs/common';
import { ViewsService } from './views.service';
import { ViewsController } from './views.controller';
import { HttpModule } from '@nestjs/axios';
import { Api } from 'src/fetch/zendesk';

@Module({
  imports: [
    HttpModule
  ],
  controllers: [ViewsController],
  providers: [ViewsService, Api],
  exports: [ViewsService],
})
export class ViewsModule {}
