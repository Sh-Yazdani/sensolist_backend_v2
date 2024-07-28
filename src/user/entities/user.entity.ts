import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId, SchemaTypes } from "mongoose";
import { Factory } from "nestjs-seeder";
import { SystemRoles } from "../../enums/role.enum";

@Schema({ timestamps: true })
export class User {

    @Factory(() => {`U${(new Date()).getTime()}`})
    @Prop({required:true})
    customID:string

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

    @Prop({ type: String, required: false })
    refreshTokenHash?: string

    @Factory(SystemRoles.NonAdmin)
    @Prop({ enum: SystemRoles, required: true, default: SystemRoles.NonAdmin })
    systemRole: SystemRoles

    @Prop({ type: SchemaTypes.ObjectId, required:false})
    customRoleId?: ObjectId

}

export const UserSchema = SchemaFactory.createForClass(User)

