import { Controller, Get, Post, Body, Patch, Param, Delete, Query, NotFoundException, Req, ParseIntPipe, UseGuards } from '@nestjs/common';
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
import { Identifier } from 'src/decorator/auth-decorator';
import { IdentityDTO } from 'src/dto/identity.dto';

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
  async create(@Body() createThingDto: CreateThingDto): Promise<MessageResponseDTO> {
    await this.thingsService.create(createThingDto);

    return {
      statusCode: 201,
      message: "thing was created"
    }
  }

  @Get("search/:page")
  @ApiOperation({ summary: "paged list of things", description: "with this API you can search and filter things. for nonAdmin users its return just granted things with View access" })
  @ApiParam({ name: "page", type: Number, description: "page number" })
  @ApiOkResponse({ type: ThingListResponseDTO })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  search(@Identifier() identity: IdentityDTO, @Query() query: ThingQueryDTO, @Param("page", ParseIntPipe) page: number) {
    return this.thingsService.search(identity, page, query);
  }

  @Get("all")
  @ApiOperation({ summary: "list of all things", description: "this api return all things, that user have access to them" })
  @ApiOkResponse({ type: ThingListResponseDTO })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  async findAll(@Identifier() identity: IdentityDTO, @Query() query: ThingQueryDTO): Promise<ThingListResponseDTO> {
    const things = await this.thingsService.getAll(identity);

    return {
      statusCode: 200,
      list: things
    }
  }

  @Get('detail/:id')
  @ApiOperation({ summary: "thing detail" })
  @ApiOkResponse({ type: ThingEntityResponseDTO })
  @ApiParam({ name: "id", type: String, description: "the thing id" })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  @ApiNotFoundResponse({ type: ErrorResponseDTO })
  @RequiredPermission(PermissionAccess.View)
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
  @RequiredPermission(PermissionAccess.Edit)
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
  @RequiredPermission(PermissionAccess.Delete)
  async remove(@Param('id') id: ObjectId): Promise<MessageResponseDTO> {
    await this.thingsService.remove(id);

    return {
      statusCode: 200,
      message: "user was deleted"
    }
  }
}
