import { Module } from '@nestjs/common';
import { ToService } from './to.service';
import { ToController } from './to.controller';
import { To } from './entities/to.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([To])
  ],
  controllers: [ToController],
  providers: [ToService]
})
export class ToModule {}
