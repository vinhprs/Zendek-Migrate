import { Controller } from '@nestjs/common';
import { CustomStatusService } from './custom-status.service';

@Controller('custom-status')
export class CustomStatusController {
  constructor(private readonly customStatusService: CustomStatusService) {}
}
