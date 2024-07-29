import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ThingsService } from './things.service';
import { CreateThingDto } from './dto/create-thing.dto';
import { UpdateThingDto } from './dto/update-thing.dto';
import { ObjectId } from 'mongoose';
import { ThingQueryDTO } from './dto/thing-search.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
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
  @ApiCreatedResponse({ type: MessageResponseDTO })
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
  @ApiOperation({summary:"a list of things", description:"you can define filter,sort and search parameters"})
  @ApiOkResponse({ type: ThingEntityResponseDTO })
  @ApiParam({name:"id", type:String, description:"the thing id"})
  findOne(@Param('id') id: ObjectId) {
    return this.thingsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: "updating a thing via id" })
  @ApiOkResponse({ type: MessageResponseDTO })
  @ApiParam({name:"id", type:String, description:"the thing id"})
  update(@Param('id') id: ObjectId, @Body() updateThingDto: UpdateThingDto) {
    return this.thingsService.update(id, updateThingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: "deleting a thing via id" })
  @ApiOkResponse({ type: MessageResponseDTO })
  @ApiParam({name:"id", type:String, description:"the thing id"})
  remove(@Param('id') id: ObjectId) {
    return this.thingsService.remove(id);
  }
}
