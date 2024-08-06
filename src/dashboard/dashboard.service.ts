import { Injectable } from '@nestjs/common';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto, UpdateDashboardWidgetsDTO } from './dto/update-dashboard.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Dashboard } from './entities/dashboard.entity';
import { Model, ObjectId } from 'mongoose';
import { DashboardListQueryhDTO } from './dto/dashboard-search.dto';
import { SortOptions } from '../enums/sort-option.enum';
import { DashboardEntityDTO } from './dto/dashboard-entity.dto';
import { IdentityDTO } from '../dto/identity.dto';
import { SystemRoles } from '../enums/role.enum';
import { UserPermissionService } from '../user-permission/user-permission.service';
import { DashboardWidgetDTO } from './dto/dashboard-widget-list.dto';
import { WidgetService } from 'src/widget/widget.service';
import { ThingsService } from 'src/things/things.service';

@Injectable()
export class DashboardService {

  constructor(
    @InjectModel(Dashboard.name) private readonly dashboardModel: Model<Dashboard>,
    private readonly permissionService: UserPermissionService,
    private readonly widgetService: WidgetService,
    private readonly thingService: ThingsService,
  ) { }

  async create(data: CreateDashboardDto) {
    await this.dashboardModel.create(data)
  }


  async search(identity: IdentityDTO, query: DashboardListQueryhDTO, page: number): Promise<{ totlaPages: number, list: DashboardEntityDTO[] }> {

    const search = query.search ?? ""
    const sort = query.sort ?? SortOptions.Newst

    let dbQuery = {}

    if (identity.systemRole != SystemRoles.Admin) {
      const allowedDashboards = await this.permissionService.getAllowedEntities(identity.userId, Dashboard)
      dbQuery = { _id: { $in: allowedDashboards } }
    }

    if (search.length > 0)
      dbQuery['name'] = new RegExp(search, 'i')

    let dashboardDBQuery = this.dashboardModel.find(dbQuery)

    if (sort == SortOptions.Name)
      dashboardDBQuery = dashboardDBQuery.sort({ name: 1 })
    else if (sort == SortOptions.Newst)
      dashboardDBQuery = dashboardDBQuery.sort({ createdAt: -1 })
    else if (sort == SortOptions.Oldest)
      dashboardDBQuery = dashboardDBQuery.sort({ createdAt: 1 })

    const dashboardds = await dashboardDBQuery.paginate({ page: page })


    return {
      totlaPages: dashboardds.totalPages,
      list: dashboardds.docs.map(d => {
        return {
          id: d._id,
          name: d.name,
          description: d.description,
          imageId: d.imageId.toString(),
          pinned: d.pinned,
        }
      })
    }

  }

  async getAll(identity: IdentityDTO): Promise<DashboardEntityDTO[]> {
    let dbQuery = {}

    if (identity.systemRole != SystemRoles.Admin) {
      const allowedDashboards = await this.permissionService.getAllowedEntities(identity.userId, Dashboard)
      dbQuery = { _id: { $in: allowedDashboards } }
    }

    const dashboards = await this.dashboardModel.find(dbQuery).exec()

    return dashboards.map(d => {
      return {
        id: d._id,
        name: d.name,
        description: d.description,
        imageId: d.imageId.toString(),
        pinned: d.pinned,
      }
    })
  }


  async findOne(id: ObjectId): Promise<DashboardEntityDTO | undefined> {
    const dashboard = await this.dashboardModel.findById(id).exec()

    if (!dashboard)
      return undefined

    return {
      id: dashboard._id,
      name: dashboard.name,
      description: dashboard.description,
      imageId: dashboard.imageId.toString(),
      pinned: dashboard.pinned,
    }
  }

  async update(id: ObjectId, data: UpdateDashboardDto): Promise<boolean> {
    const dashboard = await this.dashboardModel.findById(id).exec()

    if (!dashboard)
      return false

    await dashboard.updateOne({ ...data }).exec()

    return true
  }

  async remove(id: ObjectId): Promise<void> {
    await this.dashboardModel.deleteOne({ _id: id }).exec()
  }

  async pin(id: ObjectId, pin: boolean): Promise<boolean> {
    const dash = await this.dashboardModel.findById(id)

    if (!dash)
      return false

    dash.pinned = pin

    await dash.save()

    return true
  }

  async getPinnedDashes(): Promise<DashboardEntityDTO[]> {
    const dashboards = await this.dashboardModel.find({ pinned: true }).exec()

    return dashboards.map(d => {
      return {
        id: d._id,
        name: d.name,
        description: d.description,
        imageId: d.imageId.toString(),
        pinned: d.pinned,
      }
    })
  }

  async updateWidgets(dashId: ObjectId, data: UpdateDashboardWidgetsDTO): Promise<boolean> {
    const dashboard = await this.dashboardModel.findById(dashId).exec()

    if (!dashboard)
      return false

    dashboard.widgetConfigsId = data.widgetConfigsId

    await dashboard.save()

    return true
  }

  async getAllWidgets(dashId: ObjectId): Promise<DashboardWidgetDTO[]> {
    const result: DashboardWidgetDTO[] = []

    const dash = await this.dashboardModel.findById(dashId, { widgetConfigsId: 1 }).exec()
    const configIds = dash.widgetConfigsId

    const widgetConfigs = await this.widgetService.getWidgetConfigs(configIds)

    for (let widgetConfig of widgetConfigs) {
      const thing = await this.thingService.findOne(widgetConfig.thingId)
      const characteristics = widgetConfig.resourceCharachter
      const widget = await this.widgetService.getRawWidget(widgetConfig.widgetId)

      result.push({
        thing: thing,
        widget: widget,
        resourceCharachter: characteristics,
        config: widgetConfig.config
      })
    }

    return result
  }

}


