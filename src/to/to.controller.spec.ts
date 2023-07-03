import { Test, TestingModule } from '@nestjs/testing';
import { ToController } from './to.controller';
import { ToService } from './to.service';

describe('ToController', () => {
  let controller: ToController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToController],
      providers: [ToService],
    }).compile();

    controller = module.get<ToController>(ToController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
