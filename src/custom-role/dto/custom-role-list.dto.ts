import { ListResponseDTO } from "../../dto/response.dto";
import { CustomRoleEntity } from "./custom-role-entity.dto";
import { ApiResponseProperty } from "@nestjs/swagger";

export class CustomRoleListResponseDTO extends ListResponseDTO {

    @ApiResponseProperty({ type: [CustomRoleEntity] })
    list: CustomRoleEntity[]

}


