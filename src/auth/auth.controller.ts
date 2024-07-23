import { Controller, Post } from '@nestjs/common';
import { CheckOtpDTO, LoginDTO } from './auth.dto';
import { DataResponse, MessageResponse } from 'src/dto/response.dto';
import { AuthService } from './auth.service';


@Controller("auth")
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post("login")
    async login(data: LoginDTO): Promise<DataResponse<string>> {
        return this.authService.login(data)
    }

    @Post("otp")
    async checkOTP(data: CheckOtpDTO): Promise<MessageResponse> {
        return this.authService.checkOTP(data)
    }

}


