import { ListResponseDTO } from "src/dto/response.dto";
import { ThingEntityDTO } from "./thing-entity.dto";
import { ApiResponseProperty } from "@nestjs/swagger";

export class ThingListResponseDTO extends ListResponseDTO {

    @ApiResponseProperty({ type: [ThingEntityDTO] })
    list: ThingEntityDTO[]

}



