import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { WidgetService } from './widget.service';
import { RawWidgetGroupesResponseDTO } from './dto/widget-list.dto';
import { WidgetConfigDTO } from './dto/widget-config.dto';
import { MessageResponseDTO } from 'src/dto/response.dto';
import { ConfigWidgetResponseDTO } from './dto/config-widget.dto';

@Controller('widget')
export class WidgetController {
  constructor(private readonly widgetService: WidgetService) { }

  @Get("groupes")
  async widgteListWithGroupes(): Promise<RawWidgetGroupesResponseDTO> {
    const groupes = await this.widgetService.widgteListWithGroupes()

    return {
      statusCode: 200,
      list: groupes
    }
  }

  @Post("config")
  async storeWidgetConfig(@Body() data: WidgetConfigDTO): Promise<ConfigWidgetResponseDTO> {
    const configId = await this.widgetService.storeWidgetConfig(data)

    if (!configId)
      throw new BadRequestException("storing config is failed")

    return {
      statusCode: 200,
      configId: configId,
      message: "config is stored"
    }
  }

}

