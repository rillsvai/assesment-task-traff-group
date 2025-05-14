import { Module } from '@nestjs/common';
import { BotDetectionController } from './bot-detection.controller';
import { BotDetectionService } from './bot-detection.service';
import { HeaderIntegrityFilter } from './filters/header-integrity.filter';
import { IpReputationFilter } from './filters/ip-reputation.filter';
import { MongoModule } from '../databases/mongo/mongo.module';
import { UserAgentSafety, UserAgentSafetySchema } from './schemas/user-agent-safety.schema';

@Module({
  imports: [
    MongoModule.forFeature([{ name: UserAgentSafety.name, schema: UserAgentSafetySchema }]),
  ],
  controllers: [BotDetectionController],
  providers: [BotDetectionService, HeaderIntegrityFilter, IpReputationFilter],
})
export class BotDetectionModule {}
