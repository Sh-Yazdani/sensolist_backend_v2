import { PartialType } from '@nestjs/swagger';
import { CreateCustomRoleDto } from './create-custom-role.dto';
import { ObjectId } from "mongoose"

export class UpdateCustomRoleDto extends PartialType(CreateCustomRoleDto) {}

