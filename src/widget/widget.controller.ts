import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { WidgetService } from './widget.service';
import { RawWidgetGroupesResponseDTO } from './dto/widget-list.dto';
import { WidgetConfigDTO } from './dto/widget-config.dto';
import { ErrorResponseDTO } from '../dto/response.dto';
import { ConfigWidgetResponseDTO } from './dto/config-widget.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CheckSystemRole } from '../decorator/role.decorator';
import { SystemRoles } from '../enums/role.enum';

@Controller('widget')
@ApiTags("widget")
@CheckSystemRole([SystemRoles.Admin, SystemRoles.NonAdmin])
@ApiBearerAuth("access_token")
export class WidgetController {
  constructor(private readonly widgetService: WidgetService) { }

  @Get("groupes")
  @ApiOperation({ summary: "a grouped list of all widgets", description: "this api return all widget groups with their widgets" })
  @ApiOkResponse({ type: RawWidgetGroupesResponseDTO })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  async widgteListWithGroupes(): Promise<RawWidgetGroupesResponseDTO> {
    const groupes = await this.widgetService.widgteListWithGroupes()

    return {
      statusCode: 200,
      list: groupes
    }
  }

  @Post("config")
  @ApiOperation({ summary: "storing widget config", description: "when user adding a widget to a dashboard you should use this api for storing widget config that user insert, then this api retirn a id you should send this id's to `dashboard/update` api" })
  @ApiCreatedResponse({ type: ConfigWidgetResponseDTO })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  @ApiBadRequestResponse({ type: ErrorResponseDTO })
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

