import { Module } from '@nestjs/common';
import { CustomFieldService } from './custom-field.service';
import { CustomFieldController } from './custom-field.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomField } from './entities/custom-field.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomField])
  ],
  controllers: [CustomFieldController],
  providers: [CustomFieldService]
})
export class CustomFieldModule {}
