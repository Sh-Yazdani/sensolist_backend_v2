import { ApiProperty } from "@nestjs/swagger"
import { IsPhoneNumber, IsString } from "class-validator"

export class CreateUserDto {

    @ApiProperty({type:String})
    @IsPhoneNumber("IR")
    phonenumber: string

    @ApiProperty({type:String})
    @IsString()
    firstname: string

    @ApiProperty({type:String})
    @IsString()
    lastname: string

    @ApiProperty({type:String})
    @IsString()
    password: string
}


