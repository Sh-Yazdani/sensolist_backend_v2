import { Controller, Post } from '@nestjs/common';
import { CheckOTPResponseDTO, CheckOtpDTO, LoginDTO, LoginResponseDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@Controller("auth")
@ApiTags("Authentication")
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post("login")
    @ApiOperation({ summary: "validating password and sending OTP", description: "looking for a user with proviede phonenumber if user is exists and provided password is correct, then a OTP is send to user phonenumber" })
    @ApiOkResponse({ type: LoginResponseDTO })
    @ApiBadRequestResponse()
    async login(data: LoginDTO): Promise<LoginResponseDTO> {
        return this.authService.login(data)
    }

    @Post("otp")
    @ApiOperation({ summary: "checking otp", description: "checking otp and returning `API` token if otp is correct and not expired" })
    @ApiOkResponse({ type: CheckOTPResponseDTO })
    @ApiBadRequestResponse({ description: "happen when otp is wrong or expired" })
    async checkOTP(data: CheckOtpDTO): Promise<CheckOTPResponseDTO> {
        return this.authService.checkOTP(data)
    }

}


