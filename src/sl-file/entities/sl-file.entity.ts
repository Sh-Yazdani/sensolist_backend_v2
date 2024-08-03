import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId, Types } from "mongoose";
import { Factory } from "nestjs-seeder";

export enum FileEntity {
    Thing = "Thing"
}

@Schema({ timestamps: true })
export class SLFile {

    _id: Types.ObjectId

    @Factory(true)
    @Prop({ required: true, default: false })
    temp: boolean

    @Factory(FileEntity.Thing)
    @Prop({ required: true })
    entity: FileEntity

    @Factory(".png")
    @Prop({ required: true })
    extension: string

    @Factory("image/png")
    @Prop({ required: true })
    mime: string

    @Factory("/home/public/images/thing/temp")
    @Prop({ required: true })
    dir: string

}

export const slFileSchema = SchemaFactory.createForClass(SLFile)

