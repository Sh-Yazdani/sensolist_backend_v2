import { ApiResponseProperty } from "@nestjs/swagger"

export class MessageResponse {

    @ApiResponseProperty()
    status: number

    @ApiResponseProperty()
    message: string

}

export class DataResponse<T> extends MessageResponse {

    @ApiResponseProperty()
    data: T

}



