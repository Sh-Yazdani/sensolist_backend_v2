import { ApiResetContentResponse, ApiResponseProperty } from "@nestjs/swagger";
import { EntityResponseDTO } from "../../dto/response.dto";
import { ObjectId, Types } from "mongoose";

export class CustomRoleEntity {
    @ApiResponseProperty({ type: String })
    id: Types.ObjectId
    @ApiResponseProperty()
    name: string
    @ApiResponseProperty()
    description: string
}

export class CustomRoleEntityResponseDTO extends EntityResponseDTO {
    @ApiResponseProperty({ type: CustomRoleEntity })
    role: CustomRoleEntity
}

