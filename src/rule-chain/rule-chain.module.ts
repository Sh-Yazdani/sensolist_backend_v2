import { Module } from '@nestjs/common';
import { RuleChainService } from './rule-chain.service';
import { RuleChainController } from './rule-chain.controller';

@Module({
  controllers: [RuleChainController],
  providers: [RuleChainService],
})
export class RuleChainModule {}
