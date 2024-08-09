import { ApiResetContentResponse, ApiResponseProperty } from "@nestjs/swagger";
import { EntityResponseDTO } from "../../dto/response.dto";
import { ObjectId, Types } from "mongoose";

export class RuleChainEntity {
    @ApiResponseProperty({ type: String })
    appletId: Types.ObjectId

    @ApiResponseProperty({ type: String })
    sender_id: string

    @ApiResponseProperty({ type: String })
    sensor: string

    @ApiResponseProperty({ type: String })
    parameter: string

    @ApiResponseProperty({ type: String })
    condition: string

    @ApiResponseProperty({ type: Number })
    value: number

    @ApiResponseProperty({ type: String })
    email: string
}

export class RuleChainEntityResponseDTO extends EntityResponseDTO {
    @ApiResponseProperty({ type: RuleChainEntity })
    role: RuleChainEntity
}

