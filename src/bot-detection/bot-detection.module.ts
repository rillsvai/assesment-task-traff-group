import { Module } from '@nestjs/common';
import { BotDetectionController } from './bot-detection.controller';
import { BotDetectionService } from './bot-detection.service';
import { HeaderIntegrityFilter } from './filters/header-integrity.filter';
import { IpReputationFilter } from './filters/ip-reputation.filter';

@Module({
  controllers: [BotDetectionController],
  providers: [BotDetectionService, HeaderIntegrityFilter, IpReputationFilter],
})
export class BotDetectionModule {}
