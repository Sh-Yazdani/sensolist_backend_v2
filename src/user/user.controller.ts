import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ObjectId } from 'mongoose';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { MessageResponseDTO } from '../dto/response.dto';
import { UserListResponseDTO } from './dto/user-list.dto';
import { UserEntityResponseDTO } from './dto/user-entity.dto';
import { CheckSystemRole } from 'src/decorator/role.decorator';
import { SystemRoles } from 'src/enums/role.enum';

@Controller('user')
@ApiTags("User")
@CheckSystemRole([SystemRoles.Admin])
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @ApiOperation({ summary: "creating a new user" })
  @ApiOkResponse({ type: MessageResponseDTO })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: "list of all users" })
  @ApiOkResponse({ type: UserListResponseDTO })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: "user detail" })
  @ApiOkResponse({ type: UserEntityResponseDTO })
  @ApiParam({ name: "user id", type: String })
  findOne(@Param('id') id: ObjectId) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: "updating a user via id" })
  @ApiOkResponse({ type: MessageResponseDTO })
  @ApiParam({ name: "user id", type: String })
  update(@Param('id') id: ObjectId, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: "deleting a user via id" })
  @ApiOkResponse({ type: MessageResponseDTO })
  @ApiParam({ name: "user id", type: String })
  remove(@Param('id') id: ObjectId) {
    return this.userService.remove(id);
  }
}
