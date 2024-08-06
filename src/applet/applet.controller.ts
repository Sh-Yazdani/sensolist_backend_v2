import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards, NotFoundException } from '@nestjs/common';
import { AppletService } from './applet.service';
import { CreateAppletDto } from './dto/create-applet.dto';
import { UpdateAppletDto, UpdateAppletPinDTO } from './dto/update-applet.dto';
import { ObjectId } from 'mongoose';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ErrorResponseDTO, MessageResponseDTO } from '../dto/response.dto';
import { AppletEntityResponseDTO } from './dto/applet-entity.dto';
import { CheckSystemRole } from '../decorator/role.decorator';
import { SystemRoles } from '../enums/role.enum';
import { PermissionSubject, RequiredPermission } from '../decorator/permission.decorator';
import { Applet } from './entities/applet.entity';
import { PermissionAccess } from '../user-permission/dto/permission-model.dto';
import { PermissionGuard } from '../guard/permission.guard';
import { AppletListResponseDTO } from './dto/applet-list.dto';
import { AppletListQueryhDTO } from './dto/applet-search.dto';
import { Identifier } from '../decorator/auth-decorator';
import { IdentityDTO } from '../dto/identity.dto';

@Controller('applet')
@ApiTags("Applet")
@CheckSystemRole([SystemRoles.Admin, SystemRoles.NonAdmin])
@ApiBearerAuth("access_token")
@UseGuards(PermissionGuard)
@PermissionSubject(Applet)
export class AppletController {
  constructor(private readonly appletService: AppletService) { }

  @Post()
  @ApiOperation({ summary: "creating a new applet" })
  @ApiCreatedResponse({ type: MessageResponseDTO })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  @RequiredPermission(PermissionAccess.Add)
  async create(@Body() createAppletDto: CreateAppletDto): Promise<MessageResponseDTO> {
    await this.appletService.create(createAppletDto);

    return {
      statusCode: 201,
      message: "applet was created"
    }
  }

  @Get("search/:page")
  @ApiOperation({ summary: "paged list of applets", description: "with this API you can search and sort applet. for nonAdmin users its return just granted applet with View access" })
  @ApiParam({ name: "page", type: Number, description: "page number" })
  @ApiOkResponse({ type: AppletListResponseDTO })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  async search(@Identifier() identity:IdentityDTO, @Query() query: AppletListQueryhDTO, @Param("page", ParseIntPipe) page: number): Promise<AppletListResponseDTO> {
    const applets = await this.appletService.search(identity, query, page);

    return {
      statusCode: 200,
      page: page,
      pageCount: applets.totlaPages,
      list: applets.list
    }
  }

  @Get("all")
  @ApiOperation({ summary: "list of all applet", description: "this api return all applet, that user have access to them" })
  @ApiOkResponse({ type: AppletListResponseDTO })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  async getAll(@Identifier() identity:IdentityDTO): Promise<AppletListResponseDTO> {
    const applets = await this.appletService.getAll(identity)

    return {
      statusCode: 200,
      list: applets
    }
  }

  @Get('detail/:id')
  @ApiOperation({ summary: "applet detail" })
  @ApiOkResponse({ type: AppletEntityResponseDTO })
  @ApiParam({ name: "id", type: String, description: "the applet id" })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  @ApiNotFoundResponse({ type: ErrorResponseDTO })
  @RequiredPermission(PermissionAccess.View)
  async findOne(@Param('id') id: ObjectId): Promise<AppletEntityResponseDTO> {
    const applet = await this.appletService.findOne(id);

    if (!applet)
      throw new NotFoundException("applet is not exists")

    return {
      statusCode: 200,
      applet: applet
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: "updating a applet via id" })
  @ApiOkResponse({ type: MessageResponseDTO })
  @ApiParam({ name: "id", type: String, description: "the applet id" })
  @ApiNotFoundResponse({ type: ErrorResponseDTO })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  @RequiredPermission(PermissionAccess.Edit)
  async update(@Param('id') id: ObjectId, @Body() updateAppletDto: UpdateAppletDto): Promise<MessageResponseDTO> {
    const updated = await this.appletService.update(id, updateAppletDto);

    if (!updated)
      throw new NotFoundException("applet not found")

    return {
      statusCode: 200,
      message: "applet was updated"
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: "deleting a applet via id" })
  @ApiOkResponse({ type: MessageResponseDTO })
  @ApiParam({ name: "id", type: String, description: "the applet id" })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  @RequiredPermission(PermissionAccess.Delete)
  async remove(@Param('id') id: ObjectId): Promise<MessageResponseDTO> {
    await this.appletService.remove(id);

    return {
      statusCode: 200,
      message: "applet was deleted"
    }
  }

  @Patch("change-pin/:id")
  @ApiOperation({ summary: "change a applet pin status", description:"just users with `View` access can change it"})
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  @ApiNotFoundResponse({ type: ErrorResponseDTO })
  @ApiParam({ name: "id", type: String, description: "the applet id" })
  @ApiOkResponse({ type: MessageResponseDTO })
  @RequiredPermission(PermissionAccess.View)
  async changeAppletPin(@Param("id") id: ObjectId, @Body() data: UpdateAppletPinDTO): Promise<MessageResponseDTO> {
    await this.appletService.pin(id, data.pin)

    return {
      statusCode: 200,
      message: `applet was ${data.pin ? "pinned" : "unpinned"}`
    }
  }

  @Get("all/pinned")
  @ApiOperation({ summary: "list of pinned applet", description: "this api return all pinned applets, that user have `View` access" })
  @ApiOkResponse({ type: AppletListResponseDTO })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  @RequiredPermission(PermissionAccess.View)
  async getPinnedApplets(@Identifier() identity:IdentityDTO): Promise<AppletListResponseDTO> {
    const applets = await this.appletService.getPinnedApplets()

    return {
      statusCode: 200,
      list: applets
    }
  }

}


