import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ObjectId } from 'mongoose';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
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
  @ApiBadRequestResponse({ type: ErrorResponseDTO })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  async create(@Body() data: CreateUserDto): Promise<MessageResponseDTO> {
    const passwordHash = await this.userService.hashData(data.password)

    try {
      await this.userService.create(data, passwordHash);
    }
    catch (e) {
      throw new BadRequestException("phone number is duplicated")
    }

    return {
      statusCode: 201,
      message: "user was created"
    }
  }

  @Get()
  @ApiOperation({ summary: "list of all users" })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  @ApiOkResponse({ type: UserListResponseDTO })
  async findAll(): Promise<UserListResponseDTO> {
    const users = await this.userService.findAll();

    return {
      statusCode: 200,
      list: users
    }
  }

  @Get(':id')
  @ApiOperation({ summary: "user detail" })
  @ApiOkResponse({ type: UserEntityResponseDTO })
  @ApiParam({ name: "id", type: String, description: "the user id" })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  @ApiNotFoundResponse({ type: ErrorResponseDTO })
  async findOne(@Param('id') id: ObjectId): Promise<UserEntityResponseDTO> {
    const user = await this.userService.findOne(id);

    if (!user)
      throw new NotFoundException("user is not exists")

    return {
      statusCode: 200,
      user: user
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: "updating a user via id" })
  @ApiOkResponse({ type: MessageResponseDTO })
  @ApiParam({ name: "id", type: String, description: "the user id" })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  @ApiNotFoundResponse({ type: ErrorResponseDTO })
  async update(@Param('id') id: ObjectId, @Body() updateUserDto: UpdateUserDto): Promise<MessageResponseDTO> {
    await this.userService.update(id, updateUserDto);

    return {
      statusCode: 200,
      message: "user was updated"
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: "deleting a user via id" })
  @ApiOkResponse({ type: MessageResponseDTO })
  @ApiParam({ name: "id", type: String, description: "the user id" })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  async remove(@Param('id') id: ObjectId): Promise<MessageResponseDTO> {
    await this.userService.remove(id);

    return {
      statusCode: 200,
      message: "user was deleted"
    }
  }
}
