import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserPermissionService } from './user-permission.service';
import { UpdateUserPermissionDto } from './dto/update-user-permission.dto';
import { UserPermissionListResponseDTO } from './dto/user-permission-list.dto';
import { ObjectId } from 'mongoose';
import { MessageResponseDTO } from 'src/dto/response.dto';

@Controller('user-permission')
export class UserPermissionController {
  constructor(private readonly userPermissionService: UserPermissionService) { }

  @Patch()
  async update(@Body() data: UpdateUserPermissionDto): Promise<MessageResponseDTO> {
    await this.userPermissionService.updateUersPermissions(data)

    return {
      statusCode: 200,
      message: "permissions are updated"
    }
  }

  @Get(":id")
  async getAll(@Param("id") userId: ObjectId): Promise<UserPermissionListResponseDTO> {
    const permissions = await this.userPermissionService.getUserPermissions(userId);

    return {
      statusCode: 200,
      list: permissions
    }
  }

}
