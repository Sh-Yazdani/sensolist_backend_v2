import { ApiResponseProperty } from "@nestjs/swagger"
import { Types } from "mongoose"
import { EntityResponseDTO } from "src/dto/response.dto"

export class UserEntityDTO {
    @ApiResponseProperty({ type: String })
    id: Types.ObjectId

    @ApiResponseProperty({ type: String })
    phonenumber: string

    @ApiResponseProperty({ type: String })
    firstname: string

    @ApiResponseProperty({ type: String })
    lastname: string
}

export class UserEntityResponseDTO extends EntityResponseDTO {

    @ApiResponseProperty({ type: UserEntityDTO })
    user: UserEntityDTO

}


