import { Injectable } from '@nestjs/common';
import { CreateAppletDto } from './dto/create-applet.dto';
import { UpdateAppletDto } from './dto/update-applet.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Applet } from './entities/applet.entity';
import { Model, ObjectId } from 'mongoose';
import { AppletListQueryhDTO } from './dto/applet-search.dto';
import { SortOptions } from '../enums/sort-option.enum';
import { AppletEntityDTO } from './dto/applet-entity.dto';
import { IdentityDTO } from '../dto/identity.dto';
import { SystemRoles } from '../enums/role.enum';
import { UserPermissionService } from '../user-permission/user-permission.service';

@Injectable()
export class AppletService {

  constructor(
    @InjectModel(Applet.name) private readonly appletModel: Model<Applet>,
    private readonly permissionService: UserPermissionService
  ) { }

  async create(data: CreateAppletDto) {
    await this.appletModel.create(data)
  }


  async search(identity: IdentityDTO, query: AppletListQueryhDTO, page: number): Promise<{ totlaPages: number, list: AppletEntityDTO[] }> {

    const search = query.search ?? ""
    const sort = query.sort ?? SortOptions.Newst

    let dbQuery = {}

    if (identity.systemRole != SystemRoles.Admin) {
      const allowedApplets = await this.permissionService.getAllowedEntities(identity.userId, Applet)
      dbQuery = { _id: { $in: allowedApplets } }
    }

    if (search.length > 0)
      dbQuery['name'] = new RegExp(search, 'i')

    let appletDBQuery = this.appletModel.find(dbQuery)

    if (sort == SortOptions.Name)
      appletDBQuery = appletDBQuery.sort({ name: 1 })
    else if (sort == SortOptions.Newst)
      appletDBQuery = appletDBQuery.sort({ createdAt: -1 })
    else if (sort == SortOptions.Oldest)
      appletDBQuery = appletDBQuery.sort({ createdAt: 1 })

    const appletds = await appletDBQuery.paginate({ page: page })


    return {
      totlaPages: appletds.totalPages,
      list: appletds.docs.map(d => {
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

  async getAll(identity: IdentityDTO): Promise<AppletEntityDTO[]> {
    let dbQuery = {}

    if (identity.systemRole != SystemRoles.Admin) {
      const allowedApplets = await this.permissionService.getAllowedEntities(identity.userId, Applet)
      dbQuery = { _id: { $in: allowedApplets } }
    }

    const applets = await this.appletModel.find(dbQuery).exec()

    return applets.map(d => {
      return {
        id: d._id,
        name: d.name,
        description: d.description,
        imageId: d.imageId.toString(),
        pinned: d.pinned,
      }
    })
  }


  async findOne(id: ObjectId): Promise<AppletEntityDTO | undefined> {
    const applet = await this.appletModel.findById(id).exec()

    if (!applet)
      return undefined

    return {
      id: applet._id,
      name: applet.name,
      description: applet.description,
      imageId: applet.imageId.toString(),
      pinned: applet.pinned,
    }
  }

  async update(id: ObjectId, data: UpdateAppletDto): Promise<boolean> {
    const applet = await this.appletModel.findById(id).exec()

    if (!applet)
      return false

    await applet.updateOne({ ...data }).exec()

    return true
  }

  async remove(id: ObjectId): Promise<void> {
    await this.appletModel.deleteOne({ _id: id }).exec()
  }

  async pin(id: ObjectId, pin: boolean): Promise<boolean> {
    const applet = await this.appletModel.findById(id)

    if (!applet)
      return false

    applet.pinned = pin

    await applet.save()

    return true
  }

  async getPinnedApplets(): Promise<AppletEntityDTO[]> {
    const applets = await this.appletModel.find({ pinned: true }).exec()

    return applets.map(d => {
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


