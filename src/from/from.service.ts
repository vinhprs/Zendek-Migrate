import { Injectable } from '@nestjs/common';
import { CreateFromDto } from './dto/create-from.dto';
import { UpdateFromDto } from './dto/update-from.dto';

@Injectable()
export class FromService {
  create(createFromDto: CreateFromDto) {
    return 'This action adds a new from';
  }

  findAll() {
    return `This action returns all from`;
  }

  findOne(id: number) {
    return `This action returns a #${id} from`;
  }

  update(id: number, updateFromDto: UpdateFromDto) {
    return `This action updates a #${id} from`;
  }

  remove(id: number) {
    return `This action removes a #${id} from`;
  }
}
