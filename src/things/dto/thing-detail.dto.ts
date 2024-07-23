import { ApiProperty } from "@nestjs/swagger"

export class ThingDetailDTO {
    @ApiProperty({ type: String })
    brand: String

    @ApiProperty({ type: String })
    model: string

    @ApiProperty({ type: String })
    type: string

    @ApiProperty({ type: [String] })
    actions: string[]

    @ApiProperty({ type: [String] })
    characteristics: string[]

    @ApiProperty({ type: Date })
    activition: Date

    @ApiProperty({ type: String })
    description: string

}


