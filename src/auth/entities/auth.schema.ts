import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({timestamps:true})
export class OTP {

    @Prop({type:String})
    phonenumber: string

    @Prop({type:String})
    otp: string

    @Prop({type:String})
    token: string

    @Prop({type:String})
    date: Date

}


export const otpSchema = SchemaFactory.createForClass(OTP)


