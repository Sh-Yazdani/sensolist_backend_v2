import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
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
import { PermissionSubject, RequiredPermission } from '../decorator/permission.decorator';
import { Thing } from './entities/thing.entity';
import { PermissionAccess } from '../user-permission/dto/permission-model.dto';
import { Request } from 'supertest';
import { PermissionGuard } from '../guard/permission.guard';

@Controller('things')
@ApiTags("Things")
@CheckSystemRole([SystemRoles.Admin, SystemRoles.NonAdmin])
@ApiBearerAuth("access_token")
@UseGuards(PermissionGuard)
@PermissionSubject(Thing)
export class ThingsController {
  constructor(private readonly thingsService: ThingsService) { }

  @Post()
  @ApiOperation({ summary: "creating a new thing" })
  @ApiCreatedResponse({ type: MessageResponseDTO })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  @RequiredPermission(PermissionAccess.Add)
  create(@Body() createThingDto: CreateThingDto) {
    return this.thingsService.create(createThingDto);
  }

  @Get(":page")
  @ApiOperation({ summary: "list of all things", description: "with this API you can search and filter things, for getting all exists things, dont pass the search and filter params. for nonAdmin users its return just granted things with View access" })
  @ApiParam({ name: "page", type: Number, description: "page number" })
  @ApiOkResponse({ type: ThingListResponseDTO })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  findAll(@Req() request:Request, @Query() query: ThingQueryDTO, @Param("page", ParseIntPipe) page: number) {
    return this.thingsService.findAll(request['systemRole'], request['phonumber'], page, query);
  }

  @Get('detail/:id')
  @ApiOperation({ summary: "thing detail"})
  @ApiOkResponse({ type: ThingEntityResponseDTO })
  @ApiParam({ name: "id", type: String, description: "the thing id" })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  @ApiNotFoundResponse({ type: ErrorResponseDTO })
  @RequiredPermission(PermissionAccess.View)
  findOne(@Param('id') id: ObjectId) {
    return this.thingsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: "updating a thing via id" })
  @ApiOkResponse({ type: MessageResponseDTO })
  @ApiParam({ name: "id", type: String, description: "the thing id" })
  @ApiNotFoundResponse({ type: ErrorResponseDTO })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  @RequiredPermission(PermissionAccess.Edit)
  update(@Param('id') id: ObjectId, @Body() updateThingDto: UpdateThingDto) {
    return this.thingsService.update(id, updateThingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: "deleting a thing via id" })
  @ApiOkResponse({ type: MessageResponseDTO })
  @ApiParam({ name: "id", type: String, description: "the thing id" })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  @RequiredPermission(PermissionAccess.Delete)
  remove(@Param('id') id: ObjectId) {
    return this.thingsService.remove(id);
  }
}
