import { PartialType } from '@nestjs/swagger';
import { CreateRuleChainDto } from './create-rule-chain.dto';

export class UpdateRuleChainDto extends PartialType(CreateRuleChainDto) {}
