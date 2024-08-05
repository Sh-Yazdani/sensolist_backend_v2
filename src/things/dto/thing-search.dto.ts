import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsEnum, IsObject, IsString } from "class-validator"

export enum ThingSortOptions {
    Name = "Name",
    Oldest = "Oldest",
    Newst = "Newst",
}

export class ThingQueryDTO {
    @ApiProperty({ enum: ThingSortOptions, required: false, default: ThingSortOptions.Newst })
    @IsEnum(ThingSortOptions, { always: false })
    sort?: ThingSortOptions

    @ApiProperty({ type: [String], required: false, default: undefined })
    @IsArray({ always: false })
    brand?: string[]

    @ApiProperty({ type: [String], required: false, default: undefined })
    @IsArray({ always: false })
    type?: string[]

    @ApiProperty({ type: [String], required: false, default: undefined })
    @IsArray({ always: false })
    actions?: string[]

    @ApiProperty({ type: [String], required: false, default: undefined, description:"pass the name of charactristic"})
    @IsArray({ always: false })
    charactristics?: string[]

    @ApiProperty({ type: String, required: false })
    @IsObject()
    search?: string
}

