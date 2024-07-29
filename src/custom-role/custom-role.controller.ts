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
  @ApiInternalServerErrorResponse({type: ErrorResponseDTO})
  create(@Body() createCustomRoleDto: CreateCustomRoleDto) {
    return this.customRoleService.create(createCustomRoleDto);
  }

  @Get()
  @ApiOperation({ summary: "a list of all roles" })
  @ApiOkResponse({ type: CustomRoleListResponseDTO })
  @ApiInternalServerErrorResponse({type: ErrorResponseDTO})
  findAll() {
    return this.customRoleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: "role detail" })
  @ApiOkResponse({ type: CustomRoleEntityResponseDTO })
  @ApiParam({ name: "id", type: String, description: "the role id" })
  @ApiNotFoundResponse({ type: ErrorResponseDTO })
  @ApiInternalServerErrorResponse({type: ErrorResponseDTO})
  findOne(@Param('id') id: ObjectId) {
    return this.customRoleService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: "updating a role via id" })
  @ApiOkResponse({ type: MessageResponseDTO })
  @ApiParam({ name: "id", type: String, description: "the role id" })
  @ApiInternalServerErrorResponse({type: ErrorResponseDTO})
  update(@Param('id') id: ObjectId, @Body() updateCustomRoleDto: UpdateCustomRoleDto) {
    return this.customRoleService.update(id, updateCustomRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: "deleting a role via id" })
  @ApiOkResponse({ type: MessageResponseDTO })
  @ApiParam({ name: "id", type: String, description: "the role id" })
  @ApiInternalServerErrorResponse({type: ErrorResponseDTO})
  remove(@Param('id') id: ObjectId) {
    return this.customRoleService.remove(id);
  }
}

