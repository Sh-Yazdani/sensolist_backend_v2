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

  async findAll(query: ThingQueryDTO): Promise<ThingListResponseDTO> {

    console.dir(query)

    let thingsDBQuery = this.thingModel.find()

    if (query.actions)
      thingsDBQuery = thingsDBQuery.find({ actions: { $in: query.actions } })
    if (query.brand)
      thingsDBQuery = thingsDBQuery.find({ brand: { $in: query.brand } })
    if (query.type)
      thingsDBQuery = thingsDBQuery.find({ type: { $in: query.type } })
    if (query.charactristics)
      thingsDBQuery = thingsDBQuery.find({ characteristics: { $in: query.charactristics } })

    if (query.search)
      thingsDBQuery = thingsDBQuery.find({ name: new RegExp(query.search, 'i') })

    if (query.sort == ThingSortOptions.Name)
      thingsDBQuery = thingsDBQuery.sort({ ["name"]: 1 })

    if (query.sort == ThingSortOptions.Newst)
      thingsDBQuery = thingsDBQuery.sort({ ["createt_At"]: 1 })
    else if (query.sort == ThingSortOptions.Oldest)
      thingsDBQuery = thingsDBQuery.sort({ ["createt_At"]: -1 })


    const things = await thingsDBQuery.exec()


    return {
      statusCode: 200,
      list: things.map(t => {
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

    await thing.updateOne({...data}).exec()

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

