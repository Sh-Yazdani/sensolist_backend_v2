import { ApiResponseProperty } from "@nestjs/swagger"

export class MessageResponseDTO {

    @ApiResponseProperty()
    status: number

    @ApiResponseProperty()
    message: string

}

export class DataResponse<T> extends MessageResponseDTO {

    @ApiResponseProperty()
    data: T

}



