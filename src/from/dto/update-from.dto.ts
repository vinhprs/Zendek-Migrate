import { PartialType } from '@nestjs/mapped-types';
import { CreateFromDto } from './create-from.dto';

export class UpdateFromDto extends PartialType(CreateFromDto) {}
