import { Controller, Post } from '@nestjs/common';
import { CheckOTPResponseDTO, CheckOtpDTO, LoginDTO, LoginResponseDTO } from './auth.dto';
import { AuthService } from './auth.service';


@Controller("auth")
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post("login")
    async login(data: LoginDTO): Promise<LoginResponseDTO> {
        return this.authService.login(data)
    }

    @Post("otp")
    async checkOTP(data: CheckOtpDTO): Promise<CheckOTPResponseDTO> {
        return this.authService.checkOTP(data)
    }

}


