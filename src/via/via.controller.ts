import { Controller } from '@nestjs/common';
import { ViaService } from './via.service';

@Controller('via')
export class ViaController {
  constructor(private readonly viaService: ViaService) {}

}
