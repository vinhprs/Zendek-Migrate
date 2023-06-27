import { Injectable } from '@nestjs/common';
import { CreateToDto } from './dto/create-to.dto';
import { UpdateToDto } from './dto/update-to.dto';

@Injectable()
export class ToService {
  create(createToDto: CreateToDto) {
    return 'This action adds a new to';
  }

  findAll() {
    return `This action returns all to`;
  }

  findOne(id: number) {
    return `This action returns a #${id} to`;
  }

  update(id: number, updateToDto: UpdateToDto) {
    return `This action updates a #${id} to`;
  }

  remove(id: number) {
    return `This action removes a #${id} to`;
  }
}
