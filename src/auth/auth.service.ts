import { BadRequestException, Injectable } from '@nestjs/common';
import { CheckOTPResponseDTO, CheckOtpDTO, LoginDTO, LoginResponseDTO } from './auth.dto';
import { UserService } from 'src/user/user.service';
import { InjectModel } from '@nestjs/mongoose';
import { OTP } from './auth.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { compare as bcryptCompare } from "bcrypt"

@Injectable()
export class AuthService {

    otpLength = 6

    constructor(
        @InjectModel(OTP.name) private readonly otpModel: Model<OTP>,
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }

    async login(data: LoginDTO): Promise<LoginResponseDTO> {
        const passHash = await this.userService.getPasswordHash(data.phonenumber)

        const hashIsValid = this.checkPasswordHash(data.password, passHash)

        if (hashIsValid) {
            const otp = this.generateOTP()
            const tempToken = await this.jwtService.signAsync({ sub: "login token" })
            //TODO send OTP

            const newOtpModel = new this.otpModel({
                date: new Date(),
                otp: otp,
                phonenumber: data.phonenumber,
                token: tempToken
            })

            await newOtpModel.save()

            return {
                statusCode: 200,
                tempToken: tempToken
            }
        } else
            throw new BadRequestException("pass is wrong!")
    }

    async checkOTP(data: CheckOtpDTO): Promise<CheckOTPResponseDTO> {
        const otpObject = await this.otpModel.findOne(data).exec()
        if (!otpObject)
            throw new BadRequestException("otp not valid")

        const now = new Date()
        const expireDate = otpObject.date
        expireDate.setMinutes(expireDate.getMinutes() + 3)

        if (now > expireDate)
            throw new BadRequestException("otp is expired")

        const token = await this.jwtService.signAsync({ sub: data.pohnenumber })

        return {
            statusCode: 200,
            apiToken: token
        }
    }

    private async generateOTP() {
        return "123456" //TODO remove after sending otp functionality was add

        const raw = "A1B2C3D4E6F7G9H8I1J2K3L45M60N0O9P8Q7R6S5T4U7V8W9X3Y1Z0"
        let otp = ""
        let cIndex = 0
        for (let i = 0; i < this.otpLength; ++i) {
            cIndex = Math.random() * (raw.length - 1)
            otp += raw[Math.ceil(cIndex)]
        }

        return otp

    }

    async checkPasswordHash(password: string, hash: string): Promise<boolean> {
        return await bcryptCompare(password, hash);
    }


}


