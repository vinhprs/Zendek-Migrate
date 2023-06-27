import { Test, TestingModule } from '@nestjs/testing';
import { ViaService } from './via.service';

describe('ViaService', () => {
  let service: ViaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ViaService],
    }).compile();

    service = module.get<ViaService>(ViaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
