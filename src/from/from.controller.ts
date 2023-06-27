import { Controller } from '@nestjs/common';
import { FromService } from './from.service';

@Controller('from')
export class FromController {
  constructor(private readonly fromService: FromService) {}
}
