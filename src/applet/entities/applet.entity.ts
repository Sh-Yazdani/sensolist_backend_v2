import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Factory } from "nestjs-seeder";

@Schema({
    timestamps: true
})
export class Applet {
    @Factory(faker => faker.company.name())
    @Prop({ type: String, require: true })
    name: string

    @Factory(faker => faker.lorem.paragraph({ min: 1, max: 5 }))
    @Prop({ type: String, require: true })
    description: string

    @Factory([])
    @Prop({ type: [Types.ObjectId], require: true })
    assignedUsers: Types.ObjectId[]

    @Factory("")
    @Prop({ type: Types.ObjectId, require: true })
    imageId: Types.ObjectId

    @Factory(false)
    @Prop({ type: Boolean, require: true, default: false })
    pinned: boolean
}

export const AppletSchema = SchemaFactory.createForClass(Applet);

