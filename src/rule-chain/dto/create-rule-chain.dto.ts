import { ApiProperty } from "@nestjs/swagger"
import { Types } from "mongoose"

export class CreateRuleChainDto {

    @ApiProperty({ type: String, required: true })
    appletId: Types.ObjectId

    @ApiProperty({ type: String, required: true })
    sender_id: string

    @ApiProperty({ type: String, required: true })
    sensor: string

    @ApiProperty({ type: String, required: true })
    parameter: string

    @ApiProperty({ type: String, required: true })
    condition: string

    @ApiProperty({ type: Number, required: true })
    value: number

    @ApiProperty({ type: String, required: true })
    email: string
}
