import { ApiProperty } from "@nestjs/swagger"
import { IsDate } from "class-validator"
import { ObjectId } from "mongoose"

export class ImageModel {
    @ApiProperty({ type: String })
    fileId: ObjectId

    @ApiProperty({ type: Boolean })
    isCover: boolean
}

export class CreateThingDto {
    @ApiProperty({ type: String })
    name: string

    @ApiProperty({ type: String, nullable: true })
    brand?: String

    @ApiProperty({ type: String, nullable: true })
    model?: string

    @ApiProperty({ type: String })
    type: string

    @ApiProperty({ type: String })
    actions: string[]

    @ApiProperty({ type: String })
    characteristics: string[]

    @ApiProperty({ type: String, default: new Date()})
    @IsDate()
    activition: Date

    @ApiProperty({ type: String })
    description: string

    @ApiProperty({ type: [ImageModel] })
    images: ImageModel[]
}

