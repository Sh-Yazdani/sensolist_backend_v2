import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId, SchemaTypes } from "mongoose";
import { Factory } from "nestjs-seeder";

@Schema({ timestamps: true })
export class User {

    @Factory(faker => faker.phone.number())
    @Prop({ unique: true, required: true })
    phonenumber: string

    @Factory(faker => faker.person.firstName())
    @Prop({ required: true })
    firstname: string

    @Factory(faker => faker.person.lastName())
    @Prop({ required: true })
    lastname: string

    @Factory(faker => faker.string.uuid())
    @Prop({ required: true })
    passwordHash: string

    @Prop({ type: SchemaTypes.ObjectId, required: false, default: null })
    creator: ObjectId

    @Prop({type:String, required:false})
    refreshTokenHash?:string

}

export const UserSchema = SchemaFactory.createForClass(User)

