import { Injectable } from '@nestjs/common';
import { CreateCustomRoleDto } from './dto/create-custom-role.dto';
import { UpdateCustomRoleDto } from './dto/update-custom-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CustomRole } from './entities/custom-role.entity';
import { Model, ObjectId } from 'mongoose';
import { MessageResponseDTO } from '../dto/response.dto';
import { CustomRoleListResponseDTO } from './dto/custom-role-list.dto';
import { CustomRoleEntity, CustomRoleEntityResponseDTO } from './dto/custom-role-entity.dto';

@Injectable()
export class CustomRoleService {

  constructor(@InjectModel(CustomRole.name) private readonly customRoleModel: Model<CustomRole>) { }

  async create(data: CreateCustomRoleDto): Promise<MessageResponseDTO> {
    await this.customRoleModel.create(data)

    return {
      statusCode: 201,
      message: "role is created"
    }
  }

  async findAll(): Promise<CustomRoleListResponseDTO> {
    const roles = await this.customRoleModel.find().exec()

    return {
      list: roles.map(r => ({ name: r.name as string, description: r.description as string })),
      statusCode: 200
    }
  }

  async findOne(id: ObjectId): Promise<CustomRoleEntityResponseDTO> {
    const role = await this.customRoleModel.findById(id)

    return {
      statusCode: 200,
      role: { name: role.name as string, description: role.description as string }
    }
  }

  async update(id: ObjectId, data: UpdateCustomRoleDto): Promise<MessageResponseDTO> {
    await this.customRoleModel.updateOne({ _id: id }, { data })

    return {
      statusCode: 200,
      message: "role was updated"
    }
  }

  async remove(id: ObjectId): Promise<MessageResponseDTO> {
    await this.customRoleModel.deleteOne({ _id: id })

    return {
      statusCode: 200,
      message: "role was deleted"
    }
  }

  async getRoles(){
    return await this.customRoleModel.find().exec()
  }

}
