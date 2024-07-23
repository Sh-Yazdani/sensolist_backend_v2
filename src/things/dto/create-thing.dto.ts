import { ApiProperty } from "@nestjs/swagger"

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

    @ApiProperty({ type: String })
    activition: Date

    @ApiProperty({ type: String })
    description: string
}

