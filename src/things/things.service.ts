import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateThingDto } from './dto/create-thing.dto';
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
    const newThing = new this.thingModel(data)

    await newThing.save()

    return {
      statusCode: 201,
      message: "thing was created"
    }
  }

  async findAll(query: ThingQueryDTO): Promise<ThingListResponseDTO> {

    let thingsDBQuery = this.thingModel.find()

    if (query.filter.actions)
      thingsDBQuery = thingsDBQuery.find({ actions: { $in: query.filter.actions } })
    if (query.filter.brand)
      thingsDBQuery = thingsDBQuery.find({ brand: { $in: query.filter.brand } })
    if (query.filter.type)
      thingsDBQuery = thingsDBQuery.find({ type: { $in: query.filter.type } })
    if (query.filter.charactristics)
      thingsDBQuery = thingsDBQuery.find({ characteristics: { $in: query.filter.charactristics } })

    if (query.search)
      thingsDBQuery = thingsDBQuery.find({ name: new RegExp(query.search, 'i') })

    if (query.sort == ThingSortOptions.Name)
      thingsDBQuery = thingsDBQuery.sort({ name: 1 })

    if (query.sort == ThingSortOptions.Newst)
      thingsDBQuery = thingsDBQuery.sort({ createt_At: 1 })
    else if (query.sort == ThingSortOptions.Oldest)
      thingsDBQuery = thingsDBQuery.sort({ createt_At: -1 })


    const things = await thingsDBQuery.exec()


    return {
      statusCode: 200,
      list: things.map(t => {
        return {
          brand: t.brand,
          model: t.model,
          type: t.type,
          actions: t.actions,
          characteristics: t.characteristics,
          activition: t.activition,
          description: t.description,
        }
      })
    }
  }

  async findOne(id: ObjectId): Promise<ThingEntityResponseDTO> {
    const thing = await this.thingModel.findById(id).exec()

    return {
      statusCode: 200,
      thing: {
        brand: thing.brand,
        model: thing.model,
        type: thing.type,
        actions: thing.actions,
        characteristics: thing.characteristics,
        activition: thing.activition,
        description: thing.description,
      }
    }
  }

  async update(id: ObjectId, data: UpdateThingDto): Promise<MessageResponseDTO> {
    const user = await this.thingModel.findById(id).exec()

    if (user == undefined)
      throw new NotFoundException("id is not found")

    await user.updateOne(data).exec()

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

