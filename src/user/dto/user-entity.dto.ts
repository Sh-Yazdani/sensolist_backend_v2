import { ApiResponseProperty } from "@nestjs/swagger"
import { ObjectId, Types } from "mongoose"
import { EntityResponseDTO } from "../../dto/response.dto"

export class UserEntityDTO {
    @ApiResponseProperty({ type: Types.ObjectId })
    id: Types.ObjectId

    @ApiResponseProperty({ type: String })
    username: string

    @ApiResponseProperty({ type: String })
    phonenumber: string

    @ApiResponseProperty({ type: String })
    firstname: string

    @ApiResponseProperty({ type: String })
    lastname: string

    @ApiResponseProperty({type: String})
    customRole:String
}

export class UserEntityResponseDTO extends EntityResponseDTO {

    @ApiResponseProperty({ type: UserEntityDTO })
    user: UserEntityDTO

}


