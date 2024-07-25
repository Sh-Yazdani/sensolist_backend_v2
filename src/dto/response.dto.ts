import { ApiResponseProperty } from "@nestjs/swagger"

export class MessageResponseDTO {

    @ApiResponseProperty()
    statusCode: number

    @ApiResponseProperty()
    message: string

}

export class ListResponseDTO {
    @ApiResponseProperty()
    statusCode: number

    @ApiResponseProperty()
    page?: number

    @ApiResponseProperty()
    pageCount?: number
}


export class EntityResponseDTO {
    @ApiResponseProperty()
    statusCode: number
}


export class ErrorResponseDTO extends MessageResponseDTO {

    @ApiResponseProperty()
    readonly error: string

}


