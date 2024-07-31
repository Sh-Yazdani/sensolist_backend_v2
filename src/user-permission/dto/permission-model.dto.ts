import { ApiProperty } from "@nestjs/swagger"
import { Types } from "mongoose"

export enum PermissionAccess {
    View = "View",
    Add = "Add",
    Delete = "Delete",
    Edit = "Edit",

}

export class PermissionModel {
    @ApiProperty({ type: Types.ObjectId })
    entityId: Types.ObjectId

    @ApiProperty({ enum: PermissionAccess })
    accesses: PermissionAccess[]
}

