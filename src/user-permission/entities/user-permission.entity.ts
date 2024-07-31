import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId, SchemaType, SchemaTypes } from "mongoose";
import { PermissionModel } from "../dto/permission-model.dto";

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


