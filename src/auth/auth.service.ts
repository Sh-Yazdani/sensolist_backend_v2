import { BadRequestException, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { TokenPairResponseDTO, CheckOtpDTO, LoginDTO, LoginResponseDTO } from './dto/auth.dto';
import { UserService } from '../user/user.service';
import { InjectModel } from '@nestjs/mongoose';
import { OTP } from './entities/auth.schema';
import { Model, ObjectId } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { compare as bcryptCompare } from "bcrypt"
import { Response } from 'express';

@Injectable()
export class AuthService {

    otpLength = 6

    constructor(
        @InjectModel(OTP.name) private readonly otpModel: Model<OTP>,
        private readonly userService: UserService,
        @Inject("RefreshTokenService") private readonly refreshTokenService: JwtService,
        @Inject("ApiTokenService") private readonly apiTokenService: JwtService,
        @Inject("AccessTokenService") private readonly accesshTokenService: JwtService,
    ) { }

    async login(data: LoginDTO): Promise<LoginResponseDTO> {
        const passHash = await this.userService.getPasswordHash(data.phonenumber)

        const hashIsValid = this.checkPasswordHash(data.password, passHash)

        if (hashIsValid) {
            const otp = this.generateOTP()
            const tempToken = await this.apiTokenService.signAsync({ sub: "api token" })
            const expiresDate = new Date()
            expiresDate.setSeconds(expiresDate.getSeconds() + 120)

            const newOtpModel = new this.otpModel({
                date: new Date(),
                otp: otp,
                phonenumber: data.phonenumber,
                token: tempToken
            })

            await newOtpModel.save()

            return {
                statusCode: 200,
                otpToken: tempToken,
                expiresOn: expiresDate
            }
        } else
            throw new BadRequestException("pass is wrong!")
    }

    async checkOTP(data: CheckOtpDTO, res: Response): Promise<TokenPairResponseDTO> {
        try {
            await this.apiTokenService.verifyAsync(data.token)
        }
        catch (e) {
            throw new BadRequestException("otp token is not valid or expired")
        }

        const otpObject = await this.otpModel.findOne({ token: data.token, otp: data.otp }).exec()
        if (!otpObject)
            throw new BadRequestException("otp not valid")

        const now = new Date()
        const expireDate = otpObject.date
        expireDate.setMinutes(expireDate.getMinutes() + 3)

        if (now > expireDate)
            throw new BadRequestException("otp is expired")

        return this.generateTokenPair(otpObject.phonenumber, res)
    }

    async refreshToken(userId: string, response: Response): Promise<TokenPairResponseDTO> {
        const refreshToken = response.getHeader("refresh_token").toString()

        let payload: any
        try {
            payload = await this.refreshTokenService.verifyAsync(refreshToken)
        }
        catch (e) {
            throw new ForbiddenException("refresh token is not valid or expired")
        }

        const refreshTokenHash = await this.userService.getRefreshToksnHash(payload.sub)
        if (!refreshTokenHash)
            throw new ForbiddenException("refresh token is not valid at all")


        const isNew = bcryptCompare(refreshToken, refreshTokenHash)
        if (!isNew)
            throw new ForbiddenException("refresh token is not valid please login again")

        return this.generateTokenPair(payload.sub, response)
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

    private async generateTokenPair(phonenumber: string, res: Response): Promise<TokenPairResponseDTO> {
        const accessToken = await this.accesshTokenService.signAsync({ sub: phonenumber })
        const refreshToken = await this.refreshTokenService.signAsync({ sub: phonenumber })

        const accessExpire = new Date()
        const refreshExpire = new Date()
        accessExpire.setSeconds(accessExpire.getSeconds() + 900)
        refreshExpire.setDate(refreshExpire.getDate() + 7)

        await this.userService.storeRefreshToken(refreshToken, phonenumber)

        res.cookie("refresh_token", refreshToken, { httpOnly: true, path: "auth/refresh", expires: refreshExpire })

        return {
            statusCode: 200,
            accessToken: accessToken,
            expiresOn: accessExpire
        }
    }


}