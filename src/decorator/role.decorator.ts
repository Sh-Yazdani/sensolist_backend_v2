import { SetMetadata } from "@nestjs/common"
import { SystemRoles } from '../enums/role.enum';

export const CHECK_SYSTEM_ROLE_KEY = "CHECK_SYSTEM_ROLE_KEY"
export const CheckSystemRole = (roles: SystemRoles[]) => SetMetadata(CHECK_SYSTEM_ROLE_KEY, roles)