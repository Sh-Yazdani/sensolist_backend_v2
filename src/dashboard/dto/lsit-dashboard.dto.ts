import { ApiResponseProperty } from "@nestjs/swagger";
import { ListResponseDTO } from "src/dto/response.dto";
import { DashboardEntityDTO } from "./dashboard-entity.dto";

export class DashboardListResponseDTO extends ListResponseDTO {

    @ApiResponseProperty({ type: [DashboardEntityDTO] })
    list: DashboardEntityDTO[]
}


