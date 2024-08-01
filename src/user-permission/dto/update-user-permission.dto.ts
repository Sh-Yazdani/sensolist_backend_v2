import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";
import { PermissionModel } from "./permission-model.dto";

export class UpdateUserPermissionDto {

    @ApiProperty({ type: String })
    userId: Types.ObjectId

    @ApiProperty({ type: [PermissionModel], default: [] })
    thingsPermissions: PermissionModel[]

    @ApiProperty({ type: Boolean, default: false, description: "if operator select `add all` thats mean user can create `Things`" })
    canCreateThings: boolean

    @ApiProperty({ type: [PermissionModel], default: [] })
    apletsPermissions: PermissionModel[]

    @ApiProperty({ type: Boolean, default: false, description: "if operator select `add all` thats mean user can create `Aplets`" })
    canCreateAplets: boolean

    @ApiProperty({ type: [PermissionModel], default: [] })
    dashboardsPermissions: PermissionModel[]

    @ApiProperty({ type: Boolean, default: false, description: "if operator select `add all` thats mean user can create `Dashboards`" })
    canCreateDashboards: boolean
}
