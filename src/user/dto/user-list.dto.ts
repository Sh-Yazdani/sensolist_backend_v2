import { ApiResponseProperty, OmitType } from "@nestjs/swagger";
import { ListResponseDTO } from "../../dto/response.dto";
import { UserEntityDTO } from "./user-entity.dto";

export class UserListResponseDTO extends ListResponseDTO {

    @ApiResponseProperty({ type: [UserEntityDTO] })
    list: UserEntityDTO[]

}

