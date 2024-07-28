import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export enum FileEntity {
    Thing = "Thing"
}

@Schema({ timestamps: true })
export class SLFile {

    @Prop({ required: true, default: false })
    temp: boolean

    @Prop({ required: true })
    entity: FileEntity

    @Prop({ required: true })
    extension: string

    @Prop({ required: true })
    mime: string

    @Prop({required:true})
    dir:string

}

export const slFileSchema = SchemaFactory.createForClass(SLFile)

