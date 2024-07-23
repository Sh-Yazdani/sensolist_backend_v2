import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ThingsService } from './things.service';
import { CreateThingDto } from './dto/create-thing.dto';
import { UpdateThingDto } from './dto/update-thing.dto';
import { ObjectId } from 'mongoose';
import { ThingQueryDTO } from './dto/thing-search.dto';

@Controller('things')
export class ThingsController {
  constructor(private readonly thingsService: ThingsService) {}

  @Post()
  create(@Body() createThingDto: CreateThingDto) {
    return this.thingsService.create(createThingDto);
  }

  @Get()
  findAll(@Query() query:ThingQueryDTO) {
    return this.thingsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: ObjectId) {
    return this.thingsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: ObjectId, @Body() updateThingDto: UpdateThingDto) {
    return this.thingsService.update(id, updateThingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: ObjectId) {
    return this.thingsService.remove(id);
  }
}
