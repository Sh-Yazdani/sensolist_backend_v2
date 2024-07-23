import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId, SchemaTypes } from "mongoose";

@Schema({timestamps:true})
export class User {

    @Prop({unique:true, required:true})
    phonenumber:string

    @Prop({required:true})
    firstname:string

    @Prop({required:true})
    lastname:string

    @Prop({required:true})
    passwordHash:string

    @Prop({ type: SchemaTypes.ObjectId, required: false })
    creator:ObjectId

}

export const UserSchema = SchemaFactory.createForClass(User)

