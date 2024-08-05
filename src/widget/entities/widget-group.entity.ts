import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { ObjectId, Types } from "mongoose"
import { Factory } from "nestjs-seeder"

@Schema({ timestamps: true })
export class WidgetGroup {

    @Factory("name")
    @Prop({ type: String, required: true })
    name: string

    @Factory(faker => faker.lorem.paragraph({ min: 1, max: 3 }))
    @Prop({ type: String, required: true })
    description: string

    @Factory("imageId")
    @Prop({ type: Types.ObjectId, required: true })
    imageId: ObjectId
}

export const widgetGroupSchema = SchemaFactory.createForClass(WidgetGroup)

