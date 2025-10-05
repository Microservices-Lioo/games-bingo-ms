import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { NatsModule } from 'src/transport/nats.module';
import { RedisController } from './redis.controller';

@Module({
  imports: [NatsModule],
  providers: [RedisService],
  exports: [RedisService],
  controllers: [RedisController]
})
export class RedisModule {}
