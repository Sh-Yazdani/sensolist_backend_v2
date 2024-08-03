import { EntityResponseDTO } from "../../dto/response.dto"
import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger"

export class LoginDTO {

    @ApiProperty({ type: String, description: "user phone number", default: "+989151234567" })
    phonenumber: string

    @ApiProperty({ type: String, description: "user password", default: "123456" })
    password: string

}


export class CheckOtpDTO {

    @ApiProperty({ type: String, description: "the one type password, was sended to user phone", default: "12345" })
    otp: string

    @ApiProperty({ type: String, description: "from `/login` route, response" })
    token: string

}

export class LoginResponseDTO extends EntityResponseDTO {

    @ApiResponseProperty()
    otpToken: string

    @ApiResponseProperty()
    expiresOn: Date

}

export class TokenPairResponseDTO extends EntityResponseDTO {

    @ApiResponseProperty()
    accessToken: string

    @ApiResponseProperty()
    expiresOn: Date

}


