import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId, SchemaType, SchemaTypes, Types } from "mongoose";
import { PermissionModel } from "../dto/permission-model.dto";

@Schema({ timestamps: true })
export class UserPermission {

    @Prop({ type: Types.ObjectId, required: true })
    userId: Types.ObjectId

    @Prop({ type: [PermissionModel], required: true })
    thingsPermissions: PermissionModel[]

    @Prop({ type: [PermissionModel], required: true })
    apletsPermissions: PermissionModel[]

    @Prop({ type: [PermissionModel], required: true })
    dashboardsPermissions: PermissionModel[]
}


export const userPermissionSchema = SchemaFactory.createForClass(UserPermission)


