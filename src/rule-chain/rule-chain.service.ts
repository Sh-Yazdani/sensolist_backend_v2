import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRuleChainDto } from './dto/create-rule-chain.dto';
import { UpdateRuleChainDto } from './dto/update-rule-chain.dto';
import { InjectModel } from '@nestjs/mongoose';
import { RuleChain } from './entities/rule-chain.entity';
import { Model, ObjectId, Types } from 'mongoose';
import { MessageResponseDTO } from '../dto/response.dto';
import { RuleChainListResponseDTO } from './dto/rule-chain-list.dto';
import { RuleChainEntity, RuleChainEntityResponseDTO } from './dto/rule-chain-entity.dto';

@Injectable()
export class RuleChainService {

  constructor(
    @InjectModel(RuleChain.name) private readonly customRoleModel: Model<RuleChain>,
    private readonly httpService:HService
  ) { }

  async sendRuleToMQTTServer(data:RuleChainEntity){



  }

  async create(data: CreateRuleChainDto): Promise<void> {
    await this.customRoleModel.create(data)
  }

  async findAll(appletId: ObjectId): Promise<RuleChainEntity[]> {
    const roles = await this.customRoleModel.find({ appletId: appletId }).exec()

    return roles
  }



}
