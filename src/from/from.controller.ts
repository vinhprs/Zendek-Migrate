import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FromService } from './from.service';
import { CreateFromDto } from './dto/create-from.dto';
import { UpdateFromDto } from './dto/update-from.dto';

@Controller('from')
export class FromController {
  constructor(private readonly fromService: FromService) {}

  @Post()
  create(@Body() createFromDto: CreateFromDto) {
    return this.fromService.create(createFromDto);
  }

  @Get()
  findAll() {
    return this.fromService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fromService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFromDto: UpdateFromDto) {
    return this.fromService.update(+id, updateFromDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fromService.remove(+id);
  }
}
