import { Module } from '@nestjs/common';
import { BallCalledService } from './ball-called.service';
import { BallCalledController } from './ball-called.controller';

@Module({
  controllers: [BallCalledController],
  providers: [BallCalledService],
})
export class BallCalledModule {}
