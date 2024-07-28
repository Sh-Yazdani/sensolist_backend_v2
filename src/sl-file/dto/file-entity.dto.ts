import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";
import { Types} from "mongoose";
import { EntityResponseDTO, ErrorResponseDTO } from "src/dto/response.dto";

export class UploadTempFileImageResponseDTO extends EntityResponseDTO {

    @ApiResponseProperty()
    fileId:Types.ObjectId

}


