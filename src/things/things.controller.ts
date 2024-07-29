import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ThingsService } from './things.service';
import { CreateThingDto } from './dto/create-thing.dto';
import { UpdateThingDto } from './dto/update-thing.dto';
import { ObjectId } from 'mongoose';
import { ThingQueryDTO } from './dto/thing-search.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { MessageResponseDTO } from '../dto/response.dto';
import { ThingListResponseDTO } from './dto/thing.list.dto';
import { ThingEntityResponseDTO } from './dto/thing-entity.dto';
import { CheckSystemRole } from '../decorator/role.decorator';
import { SystemRoles } from '../enums/role.enum';

@Controller('things')
@ApiTags("Things")
@CheckSystemRole([SystemRoles.Admin, SystemRoles.NonAdmin])
@ApiBearerAuth("access_token")
export class ThingsController {
  constructor(private readonly thingsService: ThingsService) { }

  @Post()
  @ApiOperation({ summary: "creating a new thing" })
  @ApiOkResponse({ type: MessageResponseDTO })
  create(@Body() createThingDto: CreateThingDto) {
    return this.thingsService.create(createThingDto);
  }

  @Get()
  @ApiOperation({ summary: "list of all things", description: "with this API you can search and filter things, for getting all exists things, dont pass the search and filter params" })
  @ApiOkResponse({ type: ThingListResponseDTO })
  findAll(@Query() query: ThingQueryDTO) {
    return this.thingsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: "detail of thing" })
  @ApiOkResponse({ type: ThingEntityResponseDTO })
  @ApiParam({ name: "thing id", type: String })
  findOne(@Param('id') id: ObjectId) {
    return this.thingsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: "updating a thing via id" })
  @ApiOkResponse({ type: MessageResponseDTO })
  @ApiParam({ name: "thing id", type: String })
  update(@Param('id') id: ObjectId, @Body() updateThingDto: UpdateThingDto) {
    return this.thingsService.update(id, updateThingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: "deleting a thing via id" })
  @ApiOkResponse({ type: MessageResponseDTO })
  @ApiParam({ name: "thing id", type: String })
  remove(@Param('id') id: ObjectId) {
    return this.thingsService.remove(id);
  }
}
