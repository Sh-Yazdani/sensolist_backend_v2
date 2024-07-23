import { SchemaFactory } from "@nestjs/mongoose";

export class OTP {

    phonenumber: string

    otp: string

    token: string

    date: Date

}


export const otpSchema = SchemaFactory.createForClass(OTP)


