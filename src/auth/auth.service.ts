import { BadRequestException, Injectable } from '@nestjs/common';
import { CheckOtpDTO, LoginDTO } from './auth.dto';
import { UserService } from 'src/user/user.service';
import { DataResponse, MessageResponse } from 'src/dto/response.dto';
import { InjectModel } from '@nestjs/mongoose';
import { OTP } from './auth.schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {

    constructor(
        @InjectModel(OTP.name) private readonly otpModel: Model<OTP>,
        private readonly userService: UserService
    ) { }

    async login(data: LoginDTO): Promise<DataResponse<string>> {
        const passHash = this.userService.getPasswordHash(data.phonenumber)

        const hashIsValid = true //TODO checking password hash

        if (hashIsValid) {
            //TODO generate, store and send OTP
            return {
                status: 200,
                message: "otp is send",
                data: "token" //TODO generate and store token
            }
        } else
            throw new BadRequestException("pass is wrong!")
    }

    async checkOTP(data: CheckOtpDTO): Promise<MessageResponse> {
        const otpObject = await this.otpModel.findOne(data).exec()
        if (!otpObject)
            throw new BadRequestException("otp not valid")

        const now = new Date()
        const expireDate = otpObject.date
        expireDate.setMinutes(expireDate.getMinutes() + 3)

        if (now > expireDate)
            throw new BadRequestException("otp is expired")

        return {
            status: 200,
            message: "otp is ok"
        }
    }


}


