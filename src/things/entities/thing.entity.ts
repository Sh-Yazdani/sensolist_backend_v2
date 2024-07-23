import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Thing {

    @Prop({ type: String, required: true })
    name: string

    @Prop({ type: String, required: false })
    brand: String

    @Prop({ type: String, required: false })
    model: string

    @Prop({ type: String, required: true })
    type: string

    @Prop({ type: [String], required: true })
    actions: string[]

    @Prop({ type: [String], required: true })
    characteristics: string[]

    @Prop({ type: Date, required: true })
    activition: Date

    @Prop({ type: String, required: true })
    description: string

}

export const ThingSchema = SchemaFactory.createForClass(Thing)
