import { ListResponseDTO } from "../../dto/response.dto";
import { RuleChainEntity } from "./rule-chain-entity.dto";
import { ApiResponseProperty } from "@nestjs/swagger";

export class RuleChainListResponseDTO extends ListResponseDTO {

    @ApiResponseProperty({ type: [RuleChainEntity] })
    list: RuleChainEntity[]

}


