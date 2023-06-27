import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ViaService } from './via.service';
import { CreateViaDto } from './dto/create-via.dto';
import { UpdateViaDto } from './dto/update-via.dto';

@Controller('via')
export class ViaController {
  constructor(private readonly viaService: ViaService) {}

  @Post()
  create(@Body() createViaDto: CreateViaDto) {
    return this.viaService.create(createViaDto);
  }

  @Get()
  findAll() {
    return this.viaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.viaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateViaDto: UpdateViaDto) {
    return this.viaService.update(+id, updateViaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.viaService.remove(+id);
  }
}
