import { Controller, Post } from '@nestjs/common';
import { CheckOtpDTO, LoginDTO } from './auth.dto';
import { DataResponse, MessageResponseDTO } from 'src/dto/response.dto';
import { AuthService } from './auth.service';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@Controller("auth")
@ApiTags("Authentication")
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post("login")
    @ApiOperation({ summary: "validating password and sending OTP", description: "looking for a user with proviede phonenumber if user is exists and provided password is correct, then a OTP is send to user phonenumber" })
    @ApiOkResponse({ type: DataResponse })
    @ApiBadRequestResponse()
    async login(data: LoginDTO): Promise<DataResponse<string>> {
        return this.authService.login(data)
    }

    @Post("otp")
    @ApiOperation({ summary: "checking otp", description: "checking otp and returning `API` token if otp is correct and not expired" })
    @ApiOkResponse({ type: DataResponse })
    @ApiBadRequestResponse({ description: "happen when otp is wrong or expired" })
    async checkOTP(data: CheckOtpDTO): Promise<DataResponse<string>> {
        return this.authService.checkOTP(data)
    }

}


