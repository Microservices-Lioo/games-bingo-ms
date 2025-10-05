import { Module } from '@nestjs/common';
import { NumberHistoryService } from './number-history.service';
import { NumberHistoryController } from './number-history.controller';

@Module({
  controllers: [NumberHistoryController],
  providers: [NumberHistoryService],
})
export class NumberHistoryModule {}
