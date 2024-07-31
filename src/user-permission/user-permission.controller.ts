import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { UserPermissionService } from './user-permission.service';
import { UpdateUserPermissionDto } from './dto/update-user-permission.dto';
import { ObjectId } from 'mongoose';
import { ErrorResponseDTO, MessageResponseDTO } from 'src/dto/response.dto';
import { ApiBearerAuth, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CheckSystemRole } from 'src/decorator/role.decorator';
import { SystemRoles } from 'src/enums/role.enum';
import { UploadTempFileResponseDTO } from 'src/sl-file/dto/file-entity.dto';
import { UserPermissionEntityResponseDTO } from './dto/user-permission-entity.dto';

@Controller('user-permission')
@ApiTags("UserPermission")
@ApiBearerAuth("access_token")
@CheckSystemRole([SystemRoles.Admin])
export class UserPermissionController {
  constructor(private readonly userPermissionService: UserPermissionService) { }

  @Patch()
  @ApiOperation({ summary: "updating user permissions", description: "this route completely replace the user permissions with request body, so you should send new and old permissions" })
  @ApiOkResponse({ type: MessageResponseDTO })
  @ApiNotFoundResponse({ type: ErrorResponseDTO })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  async update(@Body() data: UpdateUserPermissionDto): Promise<MessageResponseDTO> {
    const userIsExists = await this.userPermissionService.userIsExists(data.userId.toString())

    if (!userIsExists)
      throw new NotFoundException("user is not exists")

    await this.userPermissionService.updateUersPermissions(data)

    return {
      statusCode: 200,
      message: "permissions are updated"
    }
  }

  @Get(":id")
  @ApiOperation({ summary: "fetching user permissions" })
  @ApiOkResponse({ type: UserPermissionEntityResponseDTO })
  @ApiParam({ type: String, name: "id", description: "user id" })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  async getAll(@Param("id") userId: ObjectId): Promise<UserPermissionEntityResponseDTO> {
    const permissions = await this.userPermissionService.getUserPermissions(userId);

    return {
      statusCode: 200,
      userPermissions: permissions
    }
  }

}
