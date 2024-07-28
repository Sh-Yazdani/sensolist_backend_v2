import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId, SchemaType, SchemaTypes } from "mongoose";

export enum PermissionAccess {
    View = "View",
    Add = "Add",
    Delete = "Delete",
    Edit = "Edit",

}

export class PermissionModel {
    entityId: ObjectId
    accesses: PermissionAccess[]
}

@Schema({ timestamps: true })
export class UserPermission {

    @Prop({ type: SchemaTypes.ObjectId, required: true })
    userId: ObjectId

    @Prop({ type: [PermissionModel], required: true })
    thingsPermissions: PermissionModel[]

    @Prop({ type: [PermissionModel], required: true })
    apletsPermissions: PermissionModel[]

    @Prop({ type: [PermissionModel], required: true })
    dashboardsPermissions: PermissionModel[]
}


const userPermissionSchema = SchemaFactory.createForClass(UserPermission)


