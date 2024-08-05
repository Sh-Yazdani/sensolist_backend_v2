import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WidgetService } from './widget.service';
import { CreateWidgetDto } from './dto/create-widget.dto';
import { UpdateWidgetDto } from './dto/update-widget.dto';
import { RawWidgetGroupesResponseDTO } from './dto/widget-list.dto';

@Controller('widget')
export class WidgetController {
  constructor(private readonly widgetService: WidgetService) { }

  @Get()
  async widgteListWithGroupes(): Promise<RawWidgetGroupesResponseDTO> {
    const groupes = await this.widgetService.widgteListWithGroupes()

    return {
      statusCode: 200,
      list: groupes
    }
  }

}
