import { ApiResponseProperty } from "@nestjs/swagger"

export class MessageResponseDTO {

    @ApiResponseProperty()
    status: number

    @ApiResponseProperty()
    message: string

}

export class ListResponseDTO {
    @ApiResponseProperty()
    status: number

    @ApiResponseProperty()
    page?: number

    @ApiResponseProperty()
    pageCount?: number
}


export class EntityResponseDTO {
    @ApiResponseProperty()
    status: number
}


