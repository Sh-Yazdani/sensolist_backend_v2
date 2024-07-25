import { EntityResponseDTO } from "src/dto/response.dto"
import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger"

export class LoginDTO {

    @ApiProperty({ type: String, description: "user phone number", default:"09123456"})
    phonenumber: string

    @ApiProperty({ type: String, description: "user password", default: "1234"})
    password: string

}


export class CheckOtpDTO {
    @ApiProperty({ type: String, description: "user phone number", default:"09123456"})
    pohnenumber: String

    @ApiProperty({ type: String, description: "the one type password, was sended to user phone", default:"123456"})
    otp: string
    
    @ApiProperty({ type: String, description: "from `/login` route, response"})
    token: string

}

export class LoginResponseDTO extends EntityResponseDTO {

    @ApiResponseProperty()
    tempToken: string

}

export class CheckOTPResponseDTO extends EntityResponseDTO {

    @ApiResponseProperty()
    apiToken: string
}


