import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ObjectId } from 'mongoose';
import { ApiBearerAuth, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ErrorResponseDTO, MessageResponseDTO } from '../dto/response.dto';
import { UserListResponseDTO } from './dto/user-list.dto';
import { UserEntityResponseDTO } from './dto/user-entity.dto';
import { CheckSystemRole } from '../decorator/role.decorator';
import { SystemRoles } from '../enums/role.enum';

@Controller('user')
@ApiTags("User")
@CheckSystemRole([SystemRoles.Admin])
@ApiBearerAuth("access_token")
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @ApiOperation({ summary: "creating a new user" })
  @ApiCreatedResponse({ type: MessageResponseDTO })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(":page")
  @ApiOperation({ summary: "list of all users" })
  @ApiParam({ name: "page", type: Number, description: "page number" })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  @ApiOkResponse({ type: UserListResponseDTO })
  findAll(@Param("page", ParseIntPipe) page: number) {
    return this.userService.findAll(page);
  }

  @Get('detail/:id')
  @ApiOperation({ summary: "user detail" })
  @ApiOkResponse({ type: UserEntityResponseDTO })
  @ApiParam({ name: "id", type: String, description: "the user id" })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  @ApiNotFoundResponse({ type: ErrorResponseDTO })
  findOne(@Param('id') id: ObjectId) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: "updating a user via id" })
  @ApiOkResponse({ type: MessageResponseDTO })
  @ApiParam({ name: "id", type: String, description: "the user id" })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  @ApiNotFoundResponse({ type: ErrorResponseDTO })
  update(@Param('id') id: ObjectId, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: "deleting a user via id" })
  @ApiOkResponse({ type: MessageResponseDTO })
  @ApiParam({ name: "id", type: String, description: "the user id" })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  remove(@Param('id') id: ObjectId) {
    return this.userService.remove(id);
  }
}
