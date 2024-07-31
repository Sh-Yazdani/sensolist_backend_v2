import { Injectable } from '@nestjs/common';
import { UpdateUserPermissionDto } from './dto/update-user-permission.dto';
import { Model, ObjectId } from 'mongoose';
import { UserPermissionEntityDTO } from './dto/user-permission-entity.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserPermission } from './entities/user-permission.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class UserPermissionService {

  constructor(
    @InjectModel(UserPermission.name) private readonly permissionModel: Model<UserPermission>,
    private readonly userService: UserService
  ) { }

  async getUserPermissions(userId: ObjectId): Promise<UserPermissionEntityDTO> {
    const permissions = await this.permissionModel.findOne({ userId: userId }).select({ _id: 0 }).exec()

    return permissions
  }

  async userIsExists(userId: string): Promise<boolean> {
    return await this.userService.userIsExists(userId)
  }

  async updateUersPermissions(data: UpdateUserPermissionDto) {
    let permission = await this.permissionModel.findOne({ userId: data.userId }).exec()

    if (!permission)
      permission = new this.permissionModel({
        userId: data.userId
      })

    permission.thingsPermissions = data.thingsPermissions
    permission.apletsPermissions = data.apletsPermissions
    permission.dashboardsPermissions = data.dashboardsPermissions

    await permission.save()
  }

}
