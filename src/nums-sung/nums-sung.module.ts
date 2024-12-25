import { Module } from '@nestjs/common';
import { NumsSungService } from './nums-sung.service';
import { NumsSungController } from './nums-sung.controller';

@Module({
  controllers: [NumsSungController],
  providers: [NumsSungService],
})
export class NumsSungModule {}
