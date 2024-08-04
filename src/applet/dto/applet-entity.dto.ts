import { ApiResponseProperty } from "@nestjs/swagger"
import { Types } from "mongoose"
import { EntityResponseDTO } from "../../dto/response.dto"

export class AppletEntityDTO {

    @ApiResponseProperty({ type: String })
    id:Types.ObjectId

    @ApiResponseProperty({ type: String })
    name: string

    @ApiResponseProperty({ type: String })
    description: string

    @ApiResponseProperty({ type: String })
    imageId: string

    @ApiResponseProperty({ type: Boolean })
    pinned: boolean

}

export class AppletEntityResponseDTO extends EntityResponseDTO{
    @ApiResponseProperty({ type: AppletEntityDTO })
    applet: AppletEntityDTO
}