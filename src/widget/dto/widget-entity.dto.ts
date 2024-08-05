import { Type } from "@nestjs/common"
import { ApiProperty } from "@nestjs/swagger"
import { Types } from "mongoose"

export class WidgetFieldDTO {
    @ApiProperty({ type: String })
    name: string

    @ApiProperty({ type: String })
    groupLabel?: string

    @ApiProperty({ type: String })
    type?: Type<any>

    @ApiProperty({ type: String })
    enum?: any[]

    @ApiProperty({ type: String })
    description: string
}


export class RawWidgetEntityDTO {

    @ApiProperty({ type: String })
    name: string

    @ApiProperty({ type: String })
    description: string

    @ApiProperty({ type: String })
    imageId: Types.ObjectId

    @ApiProperty({ type: [WidgetFieldDTO], description:"this widget fields, remember you should also add a field for charachtericts"})
    fields: WidgetFieldDTO[]
}

