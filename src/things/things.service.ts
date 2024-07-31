import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateThingDto, ImageModel } from './dto/create-thing.dto';
import { UpdateThingDto } from './dto/update-thing.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Thing } from './entities/thing.entity';
import { Model, ObjectId } from 'mongoose';
import { ThingQueryDTO, ThingSortOptions } from './dto/thing-search.dto';
import { MessageResponseDTO } from '../dto/response.dto';
import { ThingListResponseDTO } from './dto/thing.list.dto';
import { ThingEntityResponseDTO } from './dto/thing-entity.dto';

@Injectable()
export class ThingsService {

  constructor(@InjectModel(Thing.name) private readonly thingModel: Model<Thing>) { }

  async create(data: CreateThingDto): Promise<MessageResponseDTO> {
    const newThing = await this.thingModel.create(data)

    return {
      statusCode: 201,
      message: "thing was created"
    }
  }

  async findAll(page: number, query: ThingQueryDTO): Promise<ThingListResponseDTO> {

    let thingsDBQuery = this.thingModel.find()

    const dbQuery = {}

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

    thingsDBQuery = thingsDBQuery.find(dbQuery)

    if (query.sort == ThingSortOptions.Name)
      thingsDBQuery = thingsDBQuery.sort({ name: 1 })

    if (query.sort == ThingSortOptions.Newst)
      thingsDBQuery = thingsDBQuery.sort({ createdAt: -1 })
    else if (query.sort == ThingSortOptions.Oldest)
      thingsDBQuery = thingsDBQuery.sort({ createdAt: 1 })


    const things = await thingsDBQuery.paginate({ page: page })


    return {
      statusCode: 200,
      page: page,
      pageCount: things.totalPages,
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

  async findOne(id: ObjectId): Promise<ThingEntityResponseDTO> {
    const thing = await this.thingModel.findById(id).exec()

    if (!thing)
      throw new NotFoundException("thing is not exists")

    const coverImage = thing.images?.find(i => i.isCover)

    return {
      statusCode: 200,
      thing: {
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
  }

  async update(id: ObjectId, data: UpdateThingDto): Promise<MessageResponseDTO> {
    const thing = await this.thingModel.findById(id).exec()

    if (thing == undefined)
      throw new NotFoundException("id is not found")

    await thing.updateOne({ ...data }).exec()

    return {
      statusCode: 200,
      message: "user was updated"
    }
  }

  async remove(id: ObjectId) {
    await this.thingModel.deleteOne({ _id: id }).exec()

    return {
      status: 200,
      message: "user was deleted"
    }
  }

}

