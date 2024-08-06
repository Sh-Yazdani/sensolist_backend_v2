import { ApiResponseProperty } from "@nestjs/swagger";
import { ListResponseDTO } from "src/dto/response.dto";
import { ThingEntityDTO } from "src/things/dto/thing-entity.dto";
import { RawWidgetEntityDTO } from "src/widget/dto/widget-entity.dto";

export class DashboardWidgetDTO {

    @ApiResponseProperty({ type: Object })
    config: Object

    @ApiResponseProperty({ type: ThingEntityDTO })
    thing: ThingEntityDTO

    @ApiResponseProperty({ type: String })
    resourceCharachter: string

    @ApiResponseProperty({ type: RawWidgetEntityDTO })
    widget: RawWidgetEntityDTO
}

export class DashboardWidgetListResponseDTO extends ListResponseDTO {

    @ApiResponseProperty({ type: [DashboardWidgetDTO] })
    list: DashboardWidgetDTO[]

}

