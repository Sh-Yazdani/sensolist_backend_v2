import { Type } from "@nestjs/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId, Types } from "mongoose";
import { Factory } from "nestjs-seeder";

export enum WidgetFieldsUnits {
    Celsius = "Celsius",
    ACI = "ACI"
}

export class WidgetField {
    @Prop()
    name: string

    @Prop()
    groupLabel?:string

    @Prop()
    type?: string

    @Prop()
    enum?: any[]

    @Prop()
    description:string
}

@Schema({
    timestamps: true,
})
export class RawWidget {

    @Prop({ required: true })
    name: string

    @Factory(faker => faker.lorem.paragraph({ min: 1, max: 3 }))
    @Prop({ required: true })
    description: string

    @Factory("imageId")
    @Prop({ type: Types.ObjectId, required: true })
    imageId: Types.ObjectId

    @Prop({ type: Types.ObjectId, required: true, ref: "WidgetGroup" })
    widgetGroup: ObjectId

    @Prop({ type: [WidgetField], required: true })
    fields: WidgetField[]
}

export const rawWidgetSchema = SchemaFactory.createForClass(RawWidget)





