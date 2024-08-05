import { ApiResponseProperty } from "@nestjs/swagger";
import { Types } from "mongoose";
import { MessageResponseDTO } from "src/dto/response.dto";

export class ConfigWidgetResponseDTO extends MessageResponseDTO {

    @ApiResponseProperty({ type: String })
    configId: Types.ObjectId

}
