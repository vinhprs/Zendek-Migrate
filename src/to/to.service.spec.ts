import { Test, TestingModule } from '@nestjs/testing';
import { ToService } from './to.service';

describe('ToService', () => {
  let service: ToService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ToService],
    }).compile();

    service = module.get<ToService>(ToService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
