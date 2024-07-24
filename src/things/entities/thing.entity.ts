import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Factory } from "nestjs-seeder";

@Schema({ timestamps: true })
export class Thing {

    @Factory('my thing')
    @Prop({ type: String, required: true })
    name: string

    @Factory(faker => faker.company.buzzNoun())
    @Prop({ type: String, required: false })
    brand: String

    @Factory('M100')
    @Prop({ type: String, required: false })
    model: string

    @Factory('T100')
    @Prop({ type: String, required: true })
    type: string

    @Factory(['action1', 'action2'])
    @Prop({ type: [String], required: true })
    actions: string[]

    @Factory(['charachter1', 'charachter2'])
    @Prop({ type: [String], required: true })
    characteristics: string[]

    @Factory(faker => faker.date.recent({days:30}))
    @Prop({ type: Date, required: true })
    activition: Date

    @Factory(faker => faker.lorem.paragraph({min:2, max:5}))
    @Prop({ type: String, required: true })
    description: string

}

export const ThingSchema = SchemaFactory.createForClass(Thing)
