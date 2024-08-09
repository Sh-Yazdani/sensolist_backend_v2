import { Controller, Get, Post, Body, Param, Req, BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import { RuleChainService } from './rule-chain.service';
import { CreateRuleChainDto } from './dto/create-rule-chain.dto';
import { ObjectId } from 'mongoose';
import { ApiBearerAuth, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ErrorResponseDTO, MessageResponseDTO } from '../dto/response.dto';
import { CheckSystemRole } from '../decorator/role.decorator';
import { SystemRoles } from '../enums/role.enum';
import { RuleChainListResponseDTO } from './dto/rule-chain-list.dto';
import { Request } from 'express';

@Controller('rule-chain')
@ApiTags("RuleChain")
@CheckSystemRole([SystemRoles.Admin, SystemRoles.NonAdmin])
@ApiBearerAuth("access_token")
export class RuleChainController {
  constructor(private readonly ruleChainService: RuleChainService) { }

  @Post()
  @ApiOperation({ summary: "creating new rule" })
  @ApiCreatedResponse({ type: MessageResponseDTO })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  async create(@Req() request: Request, @Body() data: CreateRuleChainDto): Promise<MessageResponseDTO> {
    const authHeader = request.headers["authorization"]
    const sendedToMQTT = await this.ruleChainService.sendRuleToMQTTServer(data, authHeader)

    if (!sendedToMQTT)
      throw new ServiceUnavailableException("mqtt server not responded")

    await this.ruleChainService.create(data);

    return {
      statusCode: 201,
      message: "rule is created"
    }
  }

  @Get(":appletId")
  @ApiOperation({ summary: "a list of applet rules" })
  @ApiParam({ name: "appletId", type: Number, description: "the applet id" })
  @ApiOkResponse({ type: RuleChainListResponseDTO })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  async findAll(@Param('appletId') appletId: ObjectId): Promise<RuleChainListResponseDTO> {
    const rules = await this.ruleChainService.findAll(appletId);

    return {
      list: rules,
      statusCode: 200
    }

  }

}

