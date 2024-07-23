import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateThingDto } from './dto/create-thing.dto';
import { UpdateThingDto } from './dto/update-thing.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Thing } from './entities/thing.entity';
import { Model, ObjectId } from 'mongoose';
import { DataResponse, MessageResponseDTO } from 'src/dto/response.dto';
import { ThingDetailDTO } from './dto/thing-detail.dto';

@Injectable()
export class ThingsService {

  constructor(@InjectModel(Thing.name) private readonly thingModel: Model<Thing>) { }

  async create(data: CreateThingDto): Promise<MessageResponseDTO> {
    const newThing = new this.thingModel(data)

    await newThing.save()

    return {
      status: 201,
      message: "thing was created"
    }
  }

  async findAll(): Promise<ThingDetailDTO[]> {
    const things = await this.thingModel.find().exec()
    return things.map(t => {
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

  async findOne(id: ObjectId): Promise<ThingDetailDTO> {
    const thing = await this.thingModel.findById(id).exec()

    return {
      brand: thing.brand,
      model: thing.model,
      type: thing.type,
      actions: thing.actions,
      characteristics: thing.characteristics,
      activition: thing.activition,
      description: thing.description,
    }
  }

  async update(id: ObjectId, data: UpdateThingDto): Promise<MessageResponseDTO> {
    const user = await this.thingModel.findById(id).exec()

    if (user == undefined)
      throw new NotFoundException("id is not found")

    await user.updateOne(data).exec()

    return {
      status: 200,
      message: "user was updated"
    }
  }

  remove(id: ObjectId) {
    this.thingModel.deleteOne({ _id: id }).exec()
  }
}
