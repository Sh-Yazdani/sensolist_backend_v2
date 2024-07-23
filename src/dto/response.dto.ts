export class MessageResponse {

    status: number

    message: string

}

export class DataResponse<T> extends MessageResponse {

    data: T

}



