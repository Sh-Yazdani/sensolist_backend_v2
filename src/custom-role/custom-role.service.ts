import { Injectable } from '@nestjs/common';
import { CreateCustomRoleDto } from './dto/create-custom-role.dto';
import { UpdateCustomRoleDto } from './dto/update-custom-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CustomRole } from './entities/custom-role.entity';
import { Model, ObjectId } from 'mongoose';
import { DataResponse, MessageResponseDTO } from 'src/dto/response.dto';

@Injectable()
export class CustomRoleService {

  constructor(@InjectModel(CustomRole.name) private readonly customRoleModel: Model<CustomRole>) { }

  async create(data: CreateCustomRoleDto): Promise<MessageResponseDTO> {
    await this.customRoleModel.create(data)

    return {
      status: 201,
      message: "role is created"
    }
  }

  async findAll():Promise<DataResponse> {
    const toles = await this.customRoleModel.find()

    return {
      MessageResponseDTO
    }
  }

  findOne(id: ObjectId) {
    return this.customRoleModel.findById(id)
  }

  async update(id: ObjectId, data: UpdateCustomRoleDto):Promise<MessageResponseDTO> {
    await this.customRoleModel.updateOne({ _id: id }, { data })

    return {
      status:200,
      message:"role was updated"
    }
  }

  async remove(id: ObjectId):Promise<MessageResponseDTO> {
    await this.customRoleModel.deleteOne({ _id: id })

    return {
      status:200,
      message:"role was deleted"
    }
  }
}
