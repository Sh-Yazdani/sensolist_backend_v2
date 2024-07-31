import { ListResponseDTO } from "src/dto/response.dto";
import { UserPermissionEntityDTO } from "./user-permission-entity.dto";
import { ApiResponseProperty } from "@nestjs/swagger";

export class UserPermissionListResponseDTO extends ListResponseDTO {

    @ApiResponseProperty({ type: [UserPermissionEntityDTO] })
    list: UserPermissionEntityDTO[]

}


