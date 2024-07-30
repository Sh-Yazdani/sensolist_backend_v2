import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { CustomRoleService } from './custom-role.service';
import { CreateCustomRoleDto } from './dto/create-custom-role.dto';
import { UpdateCustomRoleDto } from './dto/update-custom-role.dto';
import { ObjectId } from 'mongoose';
import { ApiBearerAuth, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ErrorResponseDTO, MessageResponseDTO } from '../dto/response.dto';
import { CustomRoleListResponseDTO } from './dto/custom-role-list.dto';
import { CustomRoleEntityResponseDTO } from './dto/custom-role-entity.dto';
import { CheckSystemRole } from '../decorator/role.decorator';
import { SystemRoles } from '../enums/role.enum';

@Controller('custom-role')
@ApiTags("CustomRole")
@CheckSystemRole([SystemRoles.Admin])
@ApiBearerAuth("access_token")
export class CustomRoleController {
  constructor(private readonly customRoleService: CustomRoleService) { }

  @Post()
  @ApiOperation({ summary: "creating new custom role", description: "custom role can create by admin" })
  @ApiCreatedResponse({ type: MessageResponseDTO })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  async create(@Body() createCustomRoleDto: CreateCustomRoleDto): Promise<MessageResponseDTO> {
    await this.customRoleService.create(createCustomRoleDto);

    return {
      statusCode: 201,
      message: "role is created"
    }
  }

  @Get()
  @ApiOperation({ summary: "a list of all roles" })
  @ApiOkResponse({ type: CustomRoleListResponseDTO })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  async findAll(): Promise<CustomRoleListResponseDTO> {
    const roles = await this.customRoleService.findAll();

    return {
      list: roles,
      statusCode: 200
    }

  }

  @Get(':id')
  @ApiOperation({ summary: "role detail" })
  @ApiOkResponse({ type: CustomRoleEntityResponseDTO })
  @ApiParam({ name: "id", type: String, description: "the role id" })
  @ApiNotFoundResponse({ type: ErrorResponseDTO })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  async findOne(@Param('id') id: ObjectId): Promise<CustomRoleEntityResponseDTO> {
    const role = await this.customRoleService.findOne(id);

    if (!role)
      throw new NotFoundException("role is not exists")

    return {
      statusCode: 200,
      role: role
    }

  }

  @Patch(':id')
  @ApiOperation({ summary: "updating a role via id" })
  @ApiOkResponse({ type: MessageResponseDTO })
  @ApiParam({ name: "id", type: String, description: "the role id" })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  async update(@Param('id') id: ObjectId, @Body() updateCustomRoleDto: UpdateCustomRoleDto) {
    await this.customRoleService.update(id, updateCustomRoleDto);

    return {
      statusCode: 200,
      message: "role was updated"
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: "deleting a role via id" })
  @ApiOkResponse({ type: MessageResponseDTO })
  @ApiParam({ name: "id", type: String, description: "the role id" })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  async remove(@Param('id') id: ObjectId) {
    await this.customRoleService.remove(id);

    return {
      statusCode: 200,
      message: "role was deleted"
    }
  }
}

