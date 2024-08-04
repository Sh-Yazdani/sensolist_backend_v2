import { ApiResponseProperty } from "@nestjs/swagger";
import { ListResponseDTO } from "../../dto/response.dto";
import { AppletEntityDTO } from "./applet-entity.dto";

export class AppletListResponseDTO extends ListResponseDTO {

    @ApiResponseProperty({ type: [AppletEntityDTO] })
    list: AppletEntityDTO[]
}


