import { Type } from "@nestjs/common"
import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger"
import { Types } from "mongoose"

export class WidgetFieldDTO {
    @ApiResponseProperty({ type: String })
    name: string

    @ApiResponseProperty({ type: String })
    groupLabel?: string

    @ApiResponseProperty({ type: String })
    type?: Type<any>

    @ApiResponseProperty({ type: String })
    enum?: any[]

    @ApiResponseProperty({ type: String })
    description: string
}


export class RawWidgetEntityDTO {

    @ApiResponseProperty({ type: String })
    name: string

    @ApiResponseProperty({ type: String })
    description: string

    @ApiResponseProperty({ type: String })
    imageId: Types.ObjectId

    @ApiResponseProperty({ type: [WidgetFieldDTO]})
    fields: WidgetFieldDTO[]
}

