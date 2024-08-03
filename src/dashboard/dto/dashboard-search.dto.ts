import { ApiProperty } from "@nestjs/swagger";
import { SortOptions } from "../../enums/sort-option.enum";

export class DashboardListQueryhDTO {

    @ApiProperty({ enum: SortOptions, required: false, default: SortOptions.Newst })
    sort?: SortOptions

    @ApiProperty({ type: String, required: false })
    search?: string

}

