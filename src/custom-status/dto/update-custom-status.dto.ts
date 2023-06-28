import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomStatusDto } from './create-custom-status.dto';

export class UpdateCustomStatusDto extends PartialType(CreateCustomStatusDto) {}
