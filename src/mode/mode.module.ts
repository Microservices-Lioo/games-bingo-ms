import { Module } from '@nestjs/common';
import { ModeService } from './mode.service';
import { ModeController } from './mode.controller';
import { NatsModule } from 'src/transport/nats.module';

@Module({
  imports: [NatsModule],
  controllers: [ModeController],
  providers: [ModeService],
})
export class ModeModule {}
