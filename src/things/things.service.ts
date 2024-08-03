import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateThingDto, ImageModel } from './dto/create-thing.dto';
import { UpdateThingDto } from './dto/update-thing.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Thing } from './entities/thing.entity';
import { Model, ObjectId } from 'mongoose';
import { ThingQueryDTO, ThingSortOptions } from './dto/thing-search.dto';
import { ThingEntityDTO } from './dto/thing-entity.dto';
import { UserPermissionService } from '../user-permission/user-permission.service';
import { SystemRoles } from '../enums/role.enum';

@Injectable()
export class ThingsService {

  constructor(
    @InjectModel(Thing.name) private readonly thingModel: Model<Thing>,
    private readonly permissionService: UserPermissionService
  ) { }

  async create(data: CreateThingDto): Promise<void> {
    await this.thingModel.create(data)
  }

  async search(systemRole: SystemRoles, userPhonenumber: string, page: number, query: ThingQueryDTO): Promise<{list:ThingEntityDTO[], totalPages:number}> {

    let dbQuery = {}

    if (systemRole != SystemRoles.Admin) {
      const allowedThings = await this.permissionService.getAllowedEntities(userPhonenumber, Thing)
      dbQuery = { _id: { $in: allowedThings } }
    }

    const actions: string[] = query.actions ?? []
    const brand: string[] = query.brand ?? []
    const type: string[] = query.type ?? []
    const charactristics: string[] = query.charactristics ?? []
    const search: string = query.search ?? ""

    if (actions.length > 0)
      dbQuery['actions'] = { $in: actions }

    if (brand.length > 0)
      dbQuery['brand'] = { $in: brand }

    if (type.length > 0)
      dbQuery['type'] = { $in: type }

    if (charactristics.length > 0)
      dbQuery['charactristics'] = { $in: charactristics }

    if (search.length > 0)
      dbQuery['name'] = new RegExp(search, 'i')

    let thingsDBQuery = this.thingModel.find(dbQuery)

    if (query.sort == ThingSortOptions.Name)
      thingsDBQuery = thingsDBQuery.sort({ name: 1 })
    else if (query.sort == ThingSortOptions.Newst)
      thingsDBQuery = thingsDBQuery.sort({ createdAt: -1 })
    else if (query.sort == ThingSortOptions.Oldest)
      thingsDBQuery = thingsDBQuery.sort({ createdAt: 1 })


    const things = await thingsDBQuery.paginate({ page: page })

    return {
      totalPages: things.totalPages,
      list: things.docs.map(t => {
        return {
          id: t._id,
          name: t.name,
          brand: t.brand,
          model: t.model,
          type: t.type,
          actions: t.actions,
          characteristics: t.characteristics,
          activition: t.activition,
          description: t.description,
          images: t.images
        }
      })
    }
  }

  async getAll(systemRole: SystemRoles, userPhonenumber: string): Promise<ThingEntityDTO[]> {

    let dbQuery = {}

    if (systemRole != SystemRoles.Admin) {
      const allowedThings = await this.permissionService.getAllowedEntities(userPhonenumber, Thing)
      dbQuery = { _id: { $in: allowedThings } }
    }

    let thingsDBQuery = this.thingModel.find(dbQuery)

    const things = await thingsDBQuery.exec()

    return things.map(t => {
      return {
        id: t._id,
        name: t.name,
        brand: t.brand,
        model: t.model,
        type: t.type,
        actions: t.actions,
        characteristics: t.characteristics,
        activition: t.activition,
        description: t.description,
        images: t.images
      }
    })

  }

  async findOne(id: ObjectId): Promise<ThingEntityDTO | undefined> {
    const thing = await this.thingModel.findById(id).exec()

    if(!thing)
      return undefined

    const coverImage = thing.images?.find(i => i.isCover)

    return {
      id: thing._id,
      name: thing.name,
      brand: thing.brand,
      model: thing.model,
      type: thing.type,
      actions: thing.actions,
      characteristics: thing.characteristics,
      activition: thing.activition,
      description: thing.description,
      images: coverImage ? [coverImage] : []
    }
  }

  async update(id: ObjectId, data: UpdateThingDto): Promise<boolean> {
    const thing = await this.thingModel.findById(id).exec()

    if(!thing)
      return false

    await thing.updateOne({ ...data }).exec()

    return true
  }

  async remove(id: ObjectId):Promise<void> {
    await this.thingModel.deleteOne({ _id: id }).exec()
  }

}

