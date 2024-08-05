import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";
import { ObjectId, Types } from "mongoose";
import { ListResponseDTO } from "src/dto/response.dto";
import { RawWidgetEntityDTO } from "./widget-entity.dto";

export class RawWidgetGroupesDTO {
    @ApiResponseProperty({ type: String })
    name: string
    @ApiResponseProperty({ type: String })
    description: string
    @ApiResponseProperty({ type: String })
    imageId: Types.ObjectId

    @ApiResponseProperty({ type: [RawWidgetEntityDTO] })
    widgets: RawWidgetEntityDTO[]
}

export class RawWidgetGroupesResponseDTO extends ListResponseDTO {
    @ApiResponseProperty({ type: [RawWidgetGroupesDTO] })
    list: RawWidgetGroupesDTO[]
}
