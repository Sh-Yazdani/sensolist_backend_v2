import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";
import { PermissionModel } from "./permission-model.dto";

export class UpdateUserPermissionDto {
    
    @ApiProperty({type:Types.ObjectId})
    userId:Types.ObjectId

    @ApiProperty({ type: [PermissionModel]})
    thingsPermissions: PermissionModel[]

    @ApiProperty({ type: [PermissionModel]})
    apletsPermissions: PermissionModel[]

    @ApiProperty({ type: [PermissionModel]})
    dashboardsPermissions: PermissionModel[]
}
