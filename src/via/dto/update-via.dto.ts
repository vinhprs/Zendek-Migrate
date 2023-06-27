import { PartialType } from '@nestjs/mapped-types';
import { CreateViaDto } from './create-via.dto';

export class UpdateViaDto extends PartialType(CreateViaDto) {}
