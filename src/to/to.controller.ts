import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ToService } from './to.service';
import { CreateToDto } from './dto/create-to.dto';
import { UpdateToDto } from './dto/update-to.dto';

@Controller('to')
export class ToController {
  constructor(private readonly toService: ToService) {}

  @Post()
  create(@Body() createToDto: CreateToDto) {
    return this.toService.create(createToDto);
  }

  @Get()
  findAll() {
    return this.toService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.toService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateToDto: UpdateToDto) {
    return this.toService.update(+id, updateToDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.toService.remove(+id);
  }
}
