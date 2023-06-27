import { Module } from '@nestjs/common';
import { ViaService } from './via.service';
import { ViaController } from './via.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Via } from './entities/via.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Via])
  ],
  controllers: [ViaController],
  providers: [ViaService]
})
export class ViaModule {}
