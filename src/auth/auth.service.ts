import { BadRequestException, ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenPairResponseDTO, CheckOtpDTO, LoginDTO, LoginResponseDTO } from './dto/auth.dto';
import { UserService } from '../user/user.service';
import { InjectModel } from '@nestjs/mongoose';
import { OTP } from './entities/auth.schema';
import { Model, ObjectId } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { compare as bcryptCompare } from "bcrypt"
import { Response, Request } from 'express';
import { IdentityDTO } from '../dto/identity.dto';

@Injectable()
export class AuthService {

    otpLength = 5

    constructor(
        @InjectModel(OTP.name) private readonly otpModel: Model<OTP>,
        private readonly userService: UserService,
        @Inject("RefreshTokenService") private readonly refreshTokenService: JwtService,
        @Inject("ApiTokenService") private readonly apiTokenService: JwtService,
        @Inject("AccessTokenService") private readonly accesshTokenService: JwtService,
    ) { }

    async validateUserCredential(phone: string, password: string) {
        const passHash = await this.userService.getPasswordHash(phone)
        const valid = await bcryptCompare(password, passHash)
        if (!valid)
            throw new Error("password is wrong")
    }

    async sendOTP(phone: string): Promise<{ tempToken: string; expiresDate: Date }> {
        const otp = await this.generateOTP()
        const tempToken = await this.apiTokenService.signAsync({ sub: "api token" })
        const expiresDate = new Date()
        expiresDate.setSeconds(expiresDate.getSeconds() + 120)

        const newOtpModel = new this.otpModel({
            date: new Date(),
            otp: otp,
            phonenumber: phone,
            token: tempToken
        })

        await newOtpModel.save()

        return {
            tempToken,
            expiresDate
        }
    }

    async verifyOTP(data: CheckOtpDTO): Promise<IdentityDTO> {
        try {
            await this.apiTokenService.verifyAsync(data.token)
        }
        catch (e) {
            throw new BadRequestException("otp token is expired")
        }

        const otpObject = await this.otpModel.findOne({ token: data.token, otp: data.otp }).exec()
        if (!otpObject)
            throw new BadRequestException("otp not valid")

        const identity = await this.userService.getUserIdentity(otpObject.phonenumber)

        return identity
    }

    async refresh(request: Request, response: Response): Promise<IdentityDTO> {
        const refreshToken = this.fetchRefreshTokenFromCookie(request.get("cookie"))
        if (!refreshToken)
            throw new UnauthorizedException("refresh token is not exists")

        let payload: any
        try {
            payload = await this.refreshTokenService.verifyAsync(refreshToken)
        }
        catch (e) {
            throw new ForbiddenException("refresh token is not valid or expired")
        }

        const refreshTokenHash = await this.userService.getRefreshToksnHash(payload.sub.phonenumber)
        if (!refreshTokenHash)
            throw new ForbiddenException("refresh token is not valid at all")


        const isNew = await bcryptCompare(refreshToken, refreshTokenHash)
        if (!isNew)
            throw new ForbiddenException("refresh token is not valid please login again")

        return {
            userId: payload.sub.userId,
            phonenumber: payload.sub.phonenumber,
            systemRole: payload.sub.systemRole,
        }
    }

    async generateTokenPair(identity: IdentityDTO): Promise<{ accessToken: string, refreshToken: string, accessExpire: Date, refreshExpire: Date }> {
        const accessToken = await this.accesshTokenService.signAsync({ sub: identity })
        const refreshToken = await this.refreshTokenService.signAsync({ sub: identity })

        const accessExpire = new Date()
        const refreshExpire = new Date()
        accessExpire.setSeconds(accessExpire.getSeconds() + 900)
        refreshExpire.setDate(refreshExpire.getDate() + 7)

        await this.userService.storeRefreshToken(refreshToken, identity.userId)

        return {
            accessToken,
            refreshToken,
            accessExpire,
            refreshExpire
        }
    }

    private fetchRefreshTokenFromCookie(cookies: string | undefined): string | undefined {
        if (!cookies)
            return undefined

        const cookieList = cookies.split(";")
        const cookieKeyValuePair = new Map()

        for (let cookie of cookieList) {
            const [key, value] = cookie.split("=")
            cookieKeyValuePair.set(key, value)
        }

        return cookieKeyValuePair.get("refresh_token")
    }

    private async generateOTP() {
        return "12345" //TODO remove after sending otp functionality was add

        const raw = "A1B2C3D4E6F7G9H8I1J2K3L45M60N0O9P8Q7R6S5T4U7V8W9X3Y1Z0"
        let otp = ""
        let cIndex = 0
        for (let i = 0; i < this.otpLength; ++i) {
            cIndex = Math.random() * (raw.length - 1)
            otp += raw[Math.ceil(cIndex)]
        }

        return otp

    }


}