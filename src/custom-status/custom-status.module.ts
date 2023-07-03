import { Module } from '@nestjs/common';
import { CustomStatusService } from './custom-status.service';
import { CustomStatusController } from './custom-status.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomStatus } from './entities/custom-status.entity';
import { Api } from 'src/fetch/zendesk';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomStatus]),
    HttpModule
  ],
  controllers: [CustomStatusController],
  providers: [CustomStatusService, Api],
  exports: [CustomStatusService]
})
export class CustomStatusModule {}
