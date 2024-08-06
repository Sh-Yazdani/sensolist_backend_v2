import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards, NotFoundException } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto, UpdateDashboardPinDTO, UpdateDashboardWidgetsDTO } from './dto/update-dashboard.dto';
import { ObjectId } from 'mongoose';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ErrorResponseDTO, MessageResponseDTO } from '../dto/response.dto';
import { DashboardEntityResponseDTO } from './dto/dashboard-entity.dto';
import { CheckSystemRole } from '../decorator/role.decorator';
import { SystemRoles } from '../enums/role.enum';
import { PermissionSubject, RequiredPermission } from '../decorator/permission.decorator';
import { Dashboard } from './entities/dashboard.entity';
import { PermissionAccess } from '../user-permission/dto/permission-model.dto';
import { PermissionGuard } from '../guard/permission.guard';
import { DashboardListResponseDTO } from './dto/lsit-dashboard.dto';
import { DashboardListQueryhDTO } from './dto/dashboard-search.dto';
import { Identifier } from '../decorator/auth-decorator';
import { IdentityDTO } from '../dto/identity.dto';

@Controller('dashboard')
@ApiTags("Dashboard")
@CheckSystemRole([SystemRoles.Admin, SystemRoles.NonAdmin])
@ApiBearerAuth("access_token")
@UseGuards(PermissionGuard)
@PermissionSubject(Dashboard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Post()
  @ApiOperation({ summary: "creating a new dashboard" })
  @ApiCreatedResponse({ type: MessageResponseDTO })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  @RequiredPermission(PermissionAccess.Add)
  async create(@Body() createDashboardDto: CreateDashboardDto): Promise<MessageResponseDTO> {
    await this.dashboardService.create(createDashboardDto);

    return {
      statusCode: 201,
      message: "dashboard was created"
    }
  }

  @Get("search/:page")
  @ApiOperation({ summary: "paged list of dashboards", description: "with this API you can search and sort dashboard. for nonAdmin users its return just granted dashboard with View access" })
  @ApiParam({ name: "page", type: Number, description: "page number" })
  @ApiOkResponse({ type: DashboardListResponseDTO })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  async search(@Identifier() identity:IdentityDTO, @Query() query: DashboardListQueryhDTO, @Param("page", ParseIntPipe) page: number): Promise<DashboardListResponseDTO> {
    const dashboards = await this.dashboardService.search(identity, query, page);

    return {
      statusCode: 200,
      page: page,
      pageCount: dashboards.totlaPages,
      list: dashboards.list
    }
  }

  @Get("all")
  @ApiOperation({ summary: "list of all dashboard", description: "this api return all dashboard, that user have access to them" })
  @ApiOkResponse({ type: DashboardListResponseDTO })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  async getAll(@Identifier() identity:IdentityDTO): Promise<DashboardListResponseDTO> {
    const dashboards = await this.dashboardService.getAll(identity)

    return {
      statusCode: 200,
      list: dashboards
    }
  }

  @Get('detail/:id')
  @ApiOperation({ summary: "dashboard detail" })
  @ApiOkResponse({ type: DashboardEntityResponseDTO })
  @ApiParam({ name: "id", type: String, description: "the dashboard id" })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  @ApiNotFoundResponse({ type: ErrorResponseDTO })
  @RequiredPermission(PermissionAccess.View)
  async findOne(@Param('id') id: ObjectId): Promise<DashboardEntityResponseDTO> {
    const dashboard = await this.dashboardService.findOne(id);

    if (!dashboard)
      throw new NotFoundException("dashboard is not exists")

    return {
      statusCode: 200,
      dashboard: dashboard
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: "updating a dashboard info via id" })
  @ApiOkResponse({ type: MessageResponseDTO })
  @ApiParam({ name: "id", type: String, description: "the dashboard id" })
  @ApiNotFoundResponse({ type: ErrorResponseDTO })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  @RequiredPermission(PermissionAccess.Edit)
  async update(@Param('id') id: ObjectId, @Body() updateDashboardDto: UpdateDashboardDto): Promise<MessageResponseDTO> {
    const updated = await this.dashboardService.update(id, updateDashboardDto);

    if (!updated)
      throw new NotFoundException("dashboard not found")

    return {
      statusCode: 200,
      message: "dashboard was updated"
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: "deleting a dashboard via id" })
  @ApiOkResponse({ type: MessageResponseDTO })
  @ApiParam({ name: "id", type: String, description: "the dashboard id" })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  @RequiredPermission(PermissionAccess.Delete)
  async remove(@Param('id') id: ObjectId): Promise<MessageResponseDTO> {
    await this.dashboardService.remove(id);

    return {
      statusCode: 200,
      message: "dashboard was deleted"
    }
  }

  @Patch("change-pin/:id")
  @ApiOperation({ summary: "change a dashboard pin status", description:"just users with `View` access can change it"})
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  @ApiNotFoundResponse({ type: ErrorResponseDTO })
  @ApiParam({ name: "id", type: String, description: "the dashboard id" })
  @ApiOkResponse({ type: MessageResponseDTO })
  @RequiredPermission(PermissionAccess.View)
  async changeDashboardPin(@Param("id") id: ObjectId, @Body() data: UpdateDashboardPinDTO): Promise<MessageResponseDTO> {
    await this.dashboardService.pin(id, data.pin)

    return {
      statusCode: 200,
      message: `dashboard was ${data.pin ? "pinned" : "unpinned"}`
    }
  }

  @Get("all/pinned")
  @ApiOperation({ summary: "list of pinned dashboard", description: "this api return all pinned dashboards, that user have `View` access" })
  @ApiOkResponse({ type: DashboardListResponseDTO })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  @RequiredPermission(PermissionAccess.View)
  async getPinnedDashes(@Identifier() identity:IdentityDTO): Promise<DashboardListResponseDTO> {
    const dashboards = await this.dashboardService.getPinnedDashes()

    return {
      statusCode: 200,
      list: dashboards
    }
  }

  @Patch('update-widgets/:id')
  @ApiOperation({ summary: "updating a dashboard widgets", description:"this api accept new widget configs,new widget configs was replaced to all old configs" })
  @ApiOkResponse({ type: MessageResponseDTO })
  @ApiParam({ name: "id", type: String, description: "the target dashboard id" })
  @ApiNotFoundResponse({ type: ErrorResponseDTO })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  @RequiredPermission(PermissionAccess.Edit)
  async updateWidgets(@Param('id') id: ObjectId, @Body() data: UpdateDashboardWidgetsDTO): Promise<MessageResponseDTO> {
    const updated = await this.dashboardService.updateWidgets(id, data);

    if (!updated)
      throw new NotFoundException("dashboard not found")

    return {
      statusCode: 200,
      message: "dashboard widgets was updated"
    }
  }

}


