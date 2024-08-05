import { ApiProperty } from "@nestjs/swagger";
import { ObjectId, Types } from "mongoose";
import { ListResponseDTO } from "src/dto/response.dto";
import { RawWidgetEntityDTO } from "./widget-entity.dto";

export class RawWidgetGroupesDTO {
    @ApiProperty({ type: String })
    name: string
    @ApiProperty({ type: String })
    description: string
    @ApiProperty({ type: String })
    imageId: Types.ObjectId

    @ApiProperty({ type: [RawWidgetEntityDTO] })
    widgets: RawWidgetEntityDTO[]
}

export class RawWidgetGroupesResponseDTO extends ListResponseDTO {
    @ApiProperty({ type: [RawWidgetGroupesDTO] })
    list: RawWidgetGroupesDTO[]
}
