import { ObjectId, Types } from "mongoose";
import { SystemRoles } from "../enums/role.enum";

export class IdentityDTO {
    userId: Types.ObjectId
    phonenumber: string
    systemRole: SystemRoles
}

