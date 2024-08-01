import { Injectable, Type } from '@nestjs/common';
import { UpdateUserPermissionDto } from './dto/update-user-permission.dto';
import { Model, ObjectId, Types } from 'mongoose';
import { UserPermissionEntityDTO } from './dto/user-permission-entity.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserPermission } from './entities/user-permission.entity';
import { UserService } from '../user/user.service';
import { PermissionAccess, PermissionModel } from './dto/permission-model.dto';

@Injectable()
export class UserPermissionService {

  constructor(
    @InjectModel(UserPermission.name) private readonly permissionModel: Model<UserPermission>,
    private readonly userService: UserService
  ) { }

  async getUserPermissions(userId: ObjectId): Promise<UserPermissionEntityDTO> {
    const permissions = await this.permissionModel.findOne({ userId: userId }).select({ _id: 0 }).exec()

    return {
      userId: permissions.userId,
      thingsPermissions: permissions.thingsPermissions,
      canCreateThings: permissions.canCreateThings,
      apletsPermissions: permissions.apletsPermissions,
      canCreateAplets: permissions.canCreateAplets,
      dashboardsPermissions: permissions.dashboardsPermissions,
      canCreateDashboards: permissions.canCreateDashboards,
    }
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
    permission.canCreateThings = data.canCreateThings ?? false
    permission.apletsPermissions = data.apletsPermissions ?? []
    permission.canCreateAplets = data.canCreateAplets ?? false
    permission.dashboardsPermissions = data.dashboardsPermissions ?? []
    permission.canCreateDashboards = data.canCreateDashboards ?? false

    await permission.save()
  }

  async userHavPermissions(phonenumber: string, permissionSubJect: Type<any>, targetEntityId: string | undefined, requiredPermission: PermissionAccess): Promise<boolean> {

    const userId = await this.userService.getUserIdByPhonunmber(phonenumber)

    if (!userId)
      return false

    if (targetEntityId == undefined)
      return false

    const dbQuery = { userId: userId.toString() }

    let propertyKey = 'thingsPermissions'//TODO check permissionSunject
    
    dbQuery[propertyKey] = { '$elemMatch': { 'entityId': targetEntityId, 'accesses': requiredPermission } }

    const permissions = await this.permissionModel.findOne(dbQuery).exec()

    return permissions != undefined

  }

  async userHaveCreatePermission(phonenumber: string, permissionSubJect: Type<any>) {
    const userId = await this.userService.getUserIdByPhonunmber(phonenumber)

    if (!userId)
      return false

    const dbQuery = { userId: userId }

    let propertyKey = 'canCreateThings'//TODO check permissionSunject

    dbQuery[propertyKey] = true

    const permissions = await this.permissionModel.findOne(dbQuery).exec()

    return permissions != undefined

  }

  async getAllowedEntities(phonenumber: string, entity: Type<any>): Promise<Types.ObjectId[] | undefined> {
    const userId = await this.userService.getUserIdByPhonunmber(phonenumber)

    if (!userId)
      return undefined

    const dbQuery = { userId: userId }

    let propertyKey = 'thingsPermissions'//TODO check entity

    dbQuery[propertyKey] = { $elemMatch: { accesses: PermissionAccess.View } }

    const permissions = await this.permissionModel.findOne(dbQuery).exec()

    return permissions[propertyKey].map((p: PermissionModel) => p.entityId)
  }

}
