import { Body, Controller, Post, Res } from '@nestjs/common';
import { TokenPairResponseDTO, CheckOtpDTO, LoginDTO, LoginResponseDTO } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorResponseDTO } from '../dto/response.dto';
import { Response, response } from 'express';


@Controller("auth")
@ApiTags("Authentication")
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post("login")
    @ApiOperation({ summary: "validating password and sending OTP", description: "looking for a user with proviede phonenumber if user is exists and provided password is correct, then a OTP is send to user phonenumber" })
    @ApiOkResponse({ type: LoginResponseDTO })
    @ApiBadRequestResponse({ type: ErrorResponseDTO })
    @ApiNotFoundResponse({ type: ErrorResponseDTO })
    async login(@Body() data: LoginDTO): Promise<LoginResponseDTO> {
        return this.authService.login(data)
    }

    @Post("otp")
    @ApiOperation({ summary: "checking otp", description: "checking otp and returning `API` token if otp is correct and not expired" })
    @ApiOkResponse({ type: TokenPairResponseDTO })
    @ApiBadRequestResponse({ type: ErrorResponseDTO, description: "happen when otp is wrong or expired" })
    async checkOTP(@Body() data: CheckOtpDTO, @Res() response: Response): Promise<TokenPairResponseDTO> {
        return this.authService.checkOTP(data, response)
    }

    @Post('refresh')
    async refreshToken(@Res() response: Response) {
        const userId:string = ""//TODO from auth guard
        return this.authService.refreshToken(userId, response)
    }

}


