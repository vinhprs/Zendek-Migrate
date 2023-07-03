import { Test, TestingModule } from '@nestjs/testing';
import { FromService } from './from.service';

describe('FromService', () => {
  let service: FromService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FromService],
    }).compile();

    service = module.get<FromService>(FromService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
