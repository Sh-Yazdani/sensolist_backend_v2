import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomRoleDto } from './dto/create-custom-role.dto';
import { UpdateCustomRoleDto } from './dto/update-custom-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CustomRole } from './entities/custom-role.entity';
import { Model, ObjectId, Types } from 'mongoose';
import { MessageResponseDTO } from '../dto/response.dto';
import { CustomRoleListResponseDTO } from './dto/custom-role-list.dto';
import { CustomRoleEntity, CustomRoleEntityResponseDTO } from './dto/custom-role-entity.dto';

@Injectable()
export class CustomRoleService {

  constructor(@InjectModel(CustomRole.name) private readonly customRoleModel: Model<CustomRole>) { }

  async create(data: CreateCustomRoleDto): Promise<void> {
    await this.customRoleModel.create(data)
  }

  async findAll(): Promise<CustomRoleEntity[]> {
    const roles = await this.customRoleModel.find().lean().exec()

    return roles.map(r => {
      return {
        id: r._id,
        name: r.name.toString(),
        description: r.description.toString()
      }
    })
  }

  async findOne(id: ObjectId): Promise<CustomRoleEntity | undefined> {
    const role = await this.customRoleModel.findById(id).exec()

    if (!role)
      return undefined

    return {
      id: role._id,
      name: role.name.toString(),
      description: role.description.toString()
    }
  }

  async update(id: ObjectId, data: UpdateCustomRoleDto): Promise<boolean> {
    const role = await this.customRoleModel.findById(id).exec()

    if (!role)
      return false

    await role.updateOne({ ...data }).exec()

    return true
  }

  async remove(id: ObjectId): Promise<void> {
    await this.customRoleModel.deleteOne({ _id: id })
  }

  async getRoles() {
    return await this.customRoleModel.find().exec()
  }

}
