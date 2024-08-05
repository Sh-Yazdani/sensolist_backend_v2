import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WidgetService } from './widget.service';
import { CreateWidgetDto } from './dto/create-widget.dto';
import { UpdateWidgetDto } from './dto/update-widget.dto';

@Controller('widget')
export class WidgetController {
  constructor(private readonly widgetService: WidgetService) {}

  @Get()
  getGroups() {
    return this.widgetService.findAll();
  }

  @Get(':group')
  getGroupWi(@Param('id') id: string) {
    return this.widgetService.findOne(+id);
  }

}
