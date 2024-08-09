import { ApiProperty } from "@nestjs/swagger"

export class ProxyModel {
    @ApiProperty({ type: String })
    sender_id: string
    @ApiProperty({ type: [String] })
    characteristics: string[]
    @ApiProperty({ type: Number })
    page: number
    @ApiProperty({ type: Number })
    limit: number
  }