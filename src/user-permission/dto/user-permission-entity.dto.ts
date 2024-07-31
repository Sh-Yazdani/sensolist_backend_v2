import { ApiResponseProperty } from "@nestjs/swagger"
import { Types } from "mongoose"
import { PermissionModel } from "./permission-model.dto"

export class UserPermissionEntityDTO{
    @ApiResponseProperty({ type: Types.ObjectId})
    userId: Types.ObjectId

    @ApiResponseProperty({ type: [PermissionModel]})
    thingsPermissions: PermissionModel[]

    @ApiResponseProperty({ type: [PermissionModel]})
    apletsPermissions: PermissionModel[]

    @ApiResponseProperty({ type: [PermissionModel]})
    dashboardsPermissions: PermissionModel[]
}

