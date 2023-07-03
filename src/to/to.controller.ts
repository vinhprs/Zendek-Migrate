import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ToService } from './to.service';
import { CreateToDto } from './dto/create-to.dto';
import { UpdateToDto } from './dto/update-to.dto';

@Controller('to')
export class ToController {
  constructor(private readonly toService: ToService) {}
}
