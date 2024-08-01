import { Prop } from "@nestjs/mongoose"
import { ApiProperty } from "@nestjs/swagger"
import { Types } from "mongoose"

export enum PermissionAccess {
    View = "View",
    Add = "Add",
    Delete = "Delete",
    Edit = "Edit",

}

export class PermissionModel {
    @ApiProperty({ type: String })
    @Prop({ required: true, unique: true })
    entityId: Types.ObjectId

    @ApiProperty({ enum: PermissionAccess, isArray: true })
    @Prop({ required: true, unique: true })
    accesses: PermissionAccess[]
}

