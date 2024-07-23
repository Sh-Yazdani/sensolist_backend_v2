import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsEnum, IsObject, IsString } from "class-validator"

export enum ThingSortOptions {
    Name,
    Oldest,
    Newst,
}

export class ThingFilterOptions {
    @ApiProperty({ type: [String], required: false, default: undefined })
    @IsArray({ always: false })
    brand?: string[]

    @ApiProperty({ type: [String], required: false, default: undefined })
    @IsArray({ always: false })
    type?: string[]

    @ApiProperty({ type: [String], required: false, default: undefined })
    @IsArray({ always: false })
    actions?: string[]

    @ApiProperty({ type: [String], required: false, default: undefined })
    @IsArray({ always: false })
    charactristics?: string[]

}

export class ThingQueryDTO {
    @ApiProperty({ enum: ThingSortOptions, required: false, default: ThingSortOptions.Newst })
    @IsEnum(ThingSortOptions, { always: false })
    sort?: ThingSortOptions

    @ApiProperty({ type: ThingFilterOptions, required: false, default: undefined })
    filter?: ThingFilterOptions

    @ApiProperty({ type: String })
    @IsObject()
    search?: string
}

