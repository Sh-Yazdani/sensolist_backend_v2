import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { ObjectId } from "mongoose";
import { Applet } from "src/applet/entities/applet.entity";

@Schema({ timestamps: true })
export class RuleChain {

    @Prop({ type: Types.ObjectId, required: true, ref: Applet.name })
    appletId: Types.ObjectId

    @Prop({ type: String, required: true })
    sender_id: string

    @Prop({ type: String, required: true })
    sensor: string

    @Prop({ type: String, required: true })
    parameter: string

    @Prop({ type: String, required: true })
    condition: string

    @Prop({ type: Number, required: true })
    value: number

    @Prop({ type: String, required: true })
    email: string

}


export const ruleChainSchema = SchemaFactory.createForClass(RuleChain)

