import { Body, Controller, HttpCode, Post, Req, Res } from '@nestjs/common';
import { TokenPairResponseDTO, CheckOtpDTO, LoginDTO, LoginResponseDTO } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ErrorResponseDTO } from '../dto/response.dto';
import { Request, Response } from 'express';
import { UnAuthorizedRoute } from '../decorator/auth-decorator';


@Controller("auth")
@ApiTags("Authentication")
@UnAuthorizedRoute()
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post("login")
    @HttpCode(200)
    @ApiOperation({ summary: "validating password and sending OTP", description: "looking for a user with proviede phonenumber if user is exists and provided password is correct, then a OTP is send to user phonenumber" })
    @ApiOkResponse({ type: LoginResponseDTO })
    @ApiBadRequestResponse({ type: ErrorResponseDTO })
    @ApiNotFoundResponse({ type: ErrorResponseDTO })
    @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
    async login(@Body() data: LoginDTO): Promise<LoginResponseDTO> {
        return this.authService.login(data)
    }

    @Post("otp")
    @HttpCode(200)
    @ApiOperation({ summary: "checking otp", description: "checking otp and returning access token in response and refresh token as http-only coockie, if otp is correct and not expired" })
    @ApiOkResponse({ type: TokenPairResponseDTO })
    @ApiBadRequestResponse({ type: ErrorResponseDTO, description: "happen when otp is wrong or expired" })
    @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
    async checkOTP(@Body() data: CheckOtpDTO, @Res({ passthrough: true }) response: Response): Promise<TokenPairResponseDTO> {
        return this.authService.checkOTP(data, response)
    }

    @Post('refresh')
    @HttpCode(200)
    @ApiOperation({ summary: "refreshing access token", description: "use this route when user access token is expired" })
    @ApiOkResponse({ type: TokenPairResponseDTO })
    @ApiUnauthorizedResponse({ type: ErrorResponseDTO, description: "happen when refresh token is not valid, you should redirect user to login page" })
    @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
    async refreshToken(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
        return this.authService.refreshToken(request, response)
    }

}


