import { ObjectId, Types } from "mongoose";
import { SystemRoles } from "src/enums/role.enum";

export class IdentityDTO {
    userId: Types.ObjectId
    phonenumber: string
    systemRole: SystemRoles
}

