import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId, Types } from "mongoose";

@Schema({
    timestamps: true
})
export class Dashboard {

    @Prop({ type: String, require: true })
    name: string

    @Prop({ type: String, require: true })
    description: string

    @Prop({ type: [Types.ObjectId], require: true })
    assignedUsers: Types.ObjectId[]

    @Prop({ type: Types.ObjectId, require: true })
    imageId: Types.ObjectId

    @Prop({ type: Boolean, require: true, default: false })
    pinned: boolean
}

export const DashboardSchema = SchemaFactory.createForClass(Dashboard);

