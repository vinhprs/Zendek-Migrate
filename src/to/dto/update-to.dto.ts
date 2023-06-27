import { PartialType } from '@nestjs/mapped-types';
import { CreateToDto } from './create-to.dto';

export class UpdateToDto extends PartialType(CreateToDto) {}
