import { Module } from '@nestjs/common';
import { FromService } from './from.service';
import { FromController } from './from.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { From } from './entities/from.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([From])
  ],
  controllers: [FromController],
  providers: [FromService]
})
export class FromModule {}
