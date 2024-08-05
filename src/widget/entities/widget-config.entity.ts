import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId, Types } from "mongoose";

@Schema({
    timestamps: true,
})
export class WidgetConfig {

    @Prop({ type: Types.ObjectId })
    thingId: ObjectId

    @Prop({ type: Types.ObjectId, required: true })
    widgetId: ObjectId

    @Prop({ typ: String, required: true })
    resourceCharachter: string

    @Prop({ type: Object, required: true })
    config: Object
}

export const widgetConfigSchema = SchemaFactory.createForClass(WidgetConfig)





