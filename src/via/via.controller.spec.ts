import { Test, TestingModule } from '@nestjs/testing';
import { ViaController } from './via.controller';
import { ViaService } from './via.service';

describe('ViaController', () => {
  let controller: ViaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ViaController],
      providers: [ViaService],
    }).compile();

    controller = module.get<ViaController>(ViaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
