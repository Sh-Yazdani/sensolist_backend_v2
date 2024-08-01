import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger"
import { Types } from "mongoose"
import { PermissionModel } from "./permission-model.dto"
import { EntityResponseDTO } from "src/dto/response.dto"

export class UserPermissionEntityDTO {
    @ApiResponseProperty({ type: Types.ObjectId })
    userId: Types.ObjectId

    @ApiResponseProperty({ type: [PermissionModel] })
    thingsPermissions: PermissionModel[]

    @ApiResponseProperty({ type: Boolean })
    canCreateThings: boolean

    @ApiResponseProperty({ type: [PermissionModel] })
    apletsPermissions: PermissionModel[]

    @ApiResponseProperty({ type: Boolean })
    canCreateAplets: boolean

    @ApiResponseProperty({ type: [PermissionModel] })
    dashboardsPermissions: PermissionModel[]

    @ApiResponseProperty({ type: Boolean })
    canCreateDashboards: boolean
}

export class UserPermissionEntityResponseDTO extends EntityResponseDTO {

    @ApiResponseProperty({ type: UserPermissionEntityDTO })
    userPermissions: UserPermissionEntityDTO
}

