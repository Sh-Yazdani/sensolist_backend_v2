import { ApiResponseProperty, OmitType } from "@nestjs/swagger";
import { ObjectId, SchemaTypes } from "mongoose";

export class UserDetailDTO {

    @ApiResponseProperty({type:String})
    id:ObjectId

    @ApiResponseProperty({type:String})
    phonenumber: string

    @ApiResponseProperty({type:String})
    firstname: string

    @ApiResponseProperty({type:String})
    lastname: string
    
}

