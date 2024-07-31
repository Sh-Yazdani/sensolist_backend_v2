import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserPermissionService } from './user-permission.service';
import { CreateUserPermissionDto } from './dto/create-user-permission.dto';
import { UpdateUserPermissionDto } from './dto/update-user-permission.dto';

@Controller('user-permission')
export class UserPermissionController {
  constructor(private readonly userPermissionService: UserPermissionService) {}

  @Patch()
  update(@Body() createUserPermissionDto: CreateUserPermissionDto) {
    return this.userPermissionService.create(createUserPermissionDto);
  }

  @Get(":page")
  getAll() {
    return this.userPermissionService.findAll();
  }

}
