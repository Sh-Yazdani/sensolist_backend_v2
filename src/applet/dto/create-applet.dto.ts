import { ApiProperty } from "@nestjs/swagger"
import { Types } from "mongoose"

export class CreateAppletDto {
    @ApiProperty({ type: String, required: true })
    name: string

    @ApiProperty({ type: String, required: true })
    description: string

    @ApiProperty({ type: [String], required: true })
    assignedUsers: Types.ObjectId[]

    @ApiProperty({ type: String, required: true })
    imageId: Types.ObjectId
}


