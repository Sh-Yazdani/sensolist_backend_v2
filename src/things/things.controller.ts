import { Controller, Get, Post, Body, Patch, Param, Delete, Query, NotFoundException } from '@nestjs/common';
import { ThingsService } from './things.service';
import { CreateThingDto } from './dto/create-thing.dto';
import { UpdateThingDto } from './dto/update-thing.dto';
import { ObjectId } from 'mongoose';
import { ThingQueryDTO } from './dto/thing-search.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ErrorResponseDTO, MessageResponseDTO } from '../dto/response.dto';
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
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  async create(@Body() createThingDto: CreateThingDto): Promise<MessageResponseDTO> {
    await this.thingsService.create(createThingDto);

    return {
      statusCode: 201,
      message: "thing was created"
    }
  }

  @Get()
  @ApiOperation({ summary: "list of all things", description: "with this API you can search and filter things, for getting all exists things, dont pass the search and filter params" })
  @ApiOkResponse({ type: ThingListResponseDTO })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  async findAll(@Query() query: ThingQueryDTO): Promise<ThingListResponseDTO> {
    const things = await this.thingsService.findAll(query);

    return {
      statusCode: 200,
      list: things
    }
  }

  @Get(':id')
  @ApiOperation({ summary: "a list of things", description: "you can define filter,sort and search parameters" })
  @ApiOkResponse({ type: ThingEntityResponseDTO })
  @ApiParam({ name: "id", type: String, description: "the thing id" })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  @ApiNotFoundResponse({ type: ErrorResponseDTO })
  async findOne(@Param('id') id: ObjectId): Promise<ThingEntityResponseDTO> {
    const thing = await this.thingsService.findOne(id);

    if (!thing)
      throw new NotFoundException("thing is not exists")

    return {
      statusCode: 200,
      thing: thing
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: "updating a thing via id" })
  @ApiOkResponse({ type: MessageResponseDTO })
  @ApiParam({ name: "id", type: String, description: "the thing id" })
  @ApiNotFoundResponse({ type: ErrorResponseDTO })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  async update(@Param('id') id: ObjectId, @Body() updateThingDto: UpdateThingDto) {
    const updated = await this.thingsService.update(id, updateThingDto);

    if (!updated)
      throw new NotFoundException("thing not found")

    return {
      statusCode: 200,
      message: "user was updated"
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: "deleting a thing via id" })
  @ApiOkResponse({ type: MessageResponseDTO })
  @ApiParam({ name: "id", type: String, description: "the thing id" })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  async remove(@Param('id') id: ObjectId): Promise<MessageResponseDTO> {
    await this.thingsService.remove(id);

    return {
      statusCode: 200,
      message: "user was deleted"
    }
  }
}
