import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class CreateCustomRoleDto {

    @ApiProperty({ type: String, description: "role name", default: "first role" })
    @IsString()
    name: string

    @ApiProperty({ type: String, description: "role description", default: "description" })
    @IsString()
    description: string
}

