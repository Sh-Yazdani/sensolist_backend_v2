import { ApiResetContentResponse, ApiResponseProperty } from "@nestjs/swagger";
import { EntityResponseDTO } from "src/dto/response.dto";

export class CustomRoleEntity {
    @ApiResponseProperty()
    name: string
    @ApiResponseProperty()
    description: string
}

export class CustomRoleEntityResponseDTO extends EntityResponseDTO {
    @ApiResponseProperty({ type: CustomRoleEntity })
    role: CustomRoleEntity
}

