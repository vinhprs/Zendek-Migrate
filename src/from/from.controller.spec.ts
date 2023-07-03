import { Test, TestingModule } from '@nestjs/testing';
import { FromController } from './from.controller';
import { FromService } from './from.service';

describe('FromController', () => {
  let controller: FromController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FromController],
      providers: [FromService],
    }).compile();

    controller = module.get<FromController>(FromController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
