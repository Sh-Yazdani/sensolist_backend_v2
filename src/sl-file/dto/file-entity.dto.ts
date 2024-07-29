import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";
import { Types} from "mongoose";
import { EntityResponseDTO, ErrorResponseDTO } from "../../dto/response.dto";

export class UploadTempFileResponseDTO extends EntityResponseDTO {

    @ApiResponseProperty()
    fileId:Types.ObjectId

}


