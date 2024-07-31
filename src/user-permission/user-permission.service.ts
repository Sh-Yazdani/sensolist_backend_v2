import { Injectable } from '@nestjs/common';
import { UpdateUserPermissionDto } from './dto/update-user-permission.dto';
import { Model, ObjectId } from 'mongoose';
import { UserPermissionEntityDTO } from './dto/user-permission-entity.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserPermission } from './entities/user-permission.entity';

@Injectable()
export class UserPermissionService {

  constructor(
    @InjectModel(UserPermission.name) private readonly permissionModel: Model<UserPermission>
  ) { }

  async getAll(userId: ObjectId): Promise<UserPermissionEntityDTO[]> {
    const permissions = await this.permissionModel.find({ userId: userId }).exec()

    return permissions
  }

  update(id: number, updateUserPermissionDto: UpdateUserPermissionDto) {
    return `This action updates a #${id} userPermission`;
  }

}
