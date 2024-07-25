import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomRoleService } from './custom-role.service';
import { CreateCustomRoleDto } from './dto/create-custom-role.dto';
import { UpdateCustomRoleDto } from './dto/update-custom-role.dto';
import { ObjectId } from 'mongoose';
import { ApiBody, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MessageResponseDTO } from 'src/dto/response.dto';

@Controller('custom-role')
@ApiTags("CustomRole")
export class CustomRoleController {
  constructor(private readonly customRoleService: CustomRoleService) {}

  @Post()
  @ApiOperation({summary:"creating new custom role", description:"custom role can create by admin"})
  @ApiOkResponse({type: MessageResponseDTO})
  create(@Body() createCustomRoleDto: CreateCustomRoleDto) {
    return this.customRoleService.create(createCustomRoleDto);
  }

  @Get()
  findAll() {
    return this.customRoleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: ObjectId) {
    return this.customRoleService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: ObjectId, @Body() updateCustomRoleDto: UpdateCustomRoleDto) {
    return this.customRoleService.update(id, updateCustomRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: ObjectId) {
    return this.customRoleService.remove(id);
  }
}

