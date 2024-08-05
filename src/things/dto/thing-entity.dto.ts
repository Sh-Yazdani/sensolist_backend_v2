import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger"
import { ObjectId, Types } from "mongoose"
import { EntityResponseDTO } from "../../dto/response.dto"
import { ImageModel } from "./create-thing.dto"

export class ThingEntityDTO {

    @ApiResponseProperty({ type: String })
    id: Types.ObjectId


    @ApiResponseProperty({ type: String })
    name: String

    @ApiResponseProperty({ type: String })
    brand?: String

    @ApiResponseProperty({ type: String })
    model: string

    @ApiResponseProperty({ type: String })
    type: string

    @ApiResponseProperty({ type: [String] })
    actions: string[]

    @ApiResponseProperty({ type: [Object] })
    characteristics: Object[]

    @ApiResponseProperty({ type: Date })
    activition: Date

    @ApiResponseProperty({ type: String })
    description: string

    @ApiResponseProperty({ type: [String] })
    images: ImageModel[]
}

export class ThingEntityResponseDTO extends EntityResponseDTO {

    @ApiResponseProperty({ type: ThingEntityDTO })
    thing: ThingEntityDTO

}


