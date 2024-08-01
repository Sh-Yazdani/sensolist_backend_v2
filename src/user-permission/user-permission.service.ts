import { Injectable, Type } from '@nestjs/common';
import { UpdateUserPermissionDto } from './dto/update-user-permission.dto';
import { Model, ObjectId } from 'mongoose';
import { UserPermissionEntityDTO } from './dto/user-permission-entity.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserPermission } from './entities/user-permission.entity';
import { UserService } from 'src/user/user.service';
import { PermissionAccess } from './dto/permission-model.dto';
import { Thing } from 'src/things/entities/thing.entity';

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

    permission.thingsPermissions = data.thingsPermissions ?? []
    permission.apletsPermissions = data.apletsPermissions ?? []
    permission.dashboardsPermissions = data.dashboardsPermissions ?? []

    await permission.save()
  }

  async userHavPermissions(userId: ObjectId, permissionSubJect: Type<any>, targetEntityId: string | undefined, requiredPermissions: PermissionAccess[]): Promise<boolean> {

    if (targetEntityId == undefined)
      return false

    const dbQuery = { userId: userId }

    let propertyKey = 'thingsPermissions'//TODO check permissionSunject

    dbQuery[propertyKey] = { $elemMatch: { entityId: targetEntityId, accesses: { $in: requiredPermissions } } }

    const permissions = await this.permissionModel.findOne(dbQuery).exec()

    return permissions != undefined

  }

}
