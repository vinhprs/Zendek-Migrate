import { Injectable } from '@nestjs/common';
import { CreateViaDto } from './dto/create-via.dto';
import { UpdateViaDto } from './dto/update-via.dto';

@Injectable()
export class ViaService {
  create(createViaDto: CreateViaDto) {
    return 'This action adds a new via';
  }

  findAll() {
    return `This action returns all via`;
  }

  findOne(id: number) {
    return `This action returns a #${id} via`;
  }

  update(id: number, updateViaDto: UpdateViaDto) {
    return `This action updates a #${id} via`;
  }

  remove(id: number) {
    return `This action removes a #${id} via`;
  }
}
