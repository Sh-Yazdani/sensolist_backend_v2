import { Body, Controller, Post } from '@nestjs/common';
import { CheckOTPResponseDTO, CheckOtpDTO, LoginDTO, LoginResponseDTO } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorResponseDTO } from '../dto/response.dto';


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
    @ApiOkResponse({ type: CheckOTPResponseDTO })
    @ApiBadRequestResponse({ type: ErrorResponseDTO, description: "happen when otp is wrong or expired" })
    async checkOTP(@Body() data: CheckOtpDTO): Promise<CheckOTPResponseDTO> {
        return this.authService.checkOTP(data)
    }

}


