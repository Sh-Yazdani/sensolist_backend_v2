import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserPermissionService } from './user-permission.service';
import { UpdateUserPermissionDto } from './dto/update-user-permission.dto';
import { UserPermissionListResponseDTO } from './dto/user-permission-list.dto';
import { ObjectId } from 'mongoose';

@Controller('user-permission')
export class UserPermissionController {
  constructor(private readonly userPermissionService: UserPermissionService) { }

  @Patch()
  update(@Body() data: UpdateUserPermissionDto) {
    //return this.userPermissionService.create(data);
  }

  @Get(":id")
  async getAll(@Param("id") id: ObjectId): Promise<UserPermissionListResponseDTO> {
    const permissions = await this.userPermissionService.getAll(id);

    return {
      statusCode: 200,
      list: permissions
    }
  }

}
