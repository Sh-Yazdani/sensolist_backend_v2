import { Module } from '@nestjs/common';
import { RuleChainService } from './rule-chain.service';
import { RuleChainController } from './rule-chain.controller';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { RuleChain, ruleChainSchema } from './entities/rule-chain.entity';

@Module({
  controllers: [RuleChainController],
  providers: [RuleChainService],
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: RuleChain.name, schema: ruleChainSchema }])
  ]
})
export class RuleChainModule { }
