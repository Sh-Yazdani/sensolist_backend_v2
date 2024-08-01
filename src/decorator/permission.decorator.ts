import { SetMetadata, Type } from "@nestjs/common"
import { PermissionAccess } from "src/user-permission/dto/permission-model.dto"

export const REQUIRED_PERMISSION_KEY = "REQUIRED_PERMISSION_KEY"
export const PERMISSION_SUBJECT_KEY = "PERMISSION_SUBJECT_KEY"

export const RequiredPermissions = (permissions: PermissionAccess[]) => SetMetadata(REQUIRED_PERMISSION_KEY, permissions)

export const PermissionSubject = (subject: Type) => SetMetadata(PERMISSION_SUBJECT_KEY, subject)

