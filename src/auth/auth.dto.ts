import { EntityResponseDTO } from "src/dto/response.dto"

export class LoginDTO {

    phonenumber: string

    password: string

}

export class CheckOtpDTO {

    pohnenumber: String

    otp: string

    token: string

}

export class LoginResponseDTO extends EntityResponseDTO {

    tempToken: string

}

export class CheckOTPResponseDTO extends EntityResponseDTO {
    apiToken: string
}


