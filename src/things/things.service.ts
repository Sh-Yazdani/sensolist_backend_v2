import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateThingDto, ImageModel } from './dto/create-thing.dto';
import { UpdateThingDto } from './dto/update-thing.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Thing } from './entities/thing.entity';
import { Model, ObjectId } from 'mongoose';
import { ThingQueryDTO, ThingSortOptions } from './dto/thing-search.dto';
import { MessageResponseDTO } from '../dto/response.dto';
import { ThingListResponseDTO } from './dto/thing.list.dto';
import { ThingEntityDTO, ThingEntityResponseDTO } from './dto/thing-entity.dto';

@Injectable()
export class ThingsService {

  constructor(@InjectModel(Thing.name) private readonly thingModel: Model<Thing>) { }

  async create(data: CreateThingDto): Promise<void> {
    await this.thingModel.create(data)
  }

  async findAll(query: ThingQueryDTO): Promise<ThingEntityDTO[]> {

    let thingsDBQuery = this.thingModel.find()

    const actions: string[] = query.actions ?? []
    const brand: string[] = query.brand ?? []
    const type: string[] = query.type ?? []
    const charactristics: string[] = query.charactristics ?? []
    const search: string = query.search ?? ""

    thingsDBQuery = thingsDBQuery.find({
      name: new RegExp(search, 'i'),
      actions: { $in: actions },
      brand: { $in: brand },
      type: { $in: type },
      charactristics: { $in: charactristics },
    })

    if (query.sort == ThingSortOptions.Name)
      thingsDBQuery = thingsDBQuery.sort({ name: 1 })

    if (query.sort == ThingSortOptions.Newst)
      thingsDBQuery = thingsDBQuery.sort({ createdAt: -1 })
    else if (query.sort == ThingSortOptions.Oldest)
      thingsDBQuery = thingsDBQuery.sort({ createdAt: 1 })


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

