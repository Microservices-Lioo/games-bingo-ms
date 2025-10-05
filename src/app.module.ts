import { Module } from '@nestjs/common';
import { GameModule } from './game/game.module';
import { RedisModule } from './redis/redis.module';
import { NatsModule } from './transport/nats.module';
import { RoomModule } from './room/room.module';
import { MembersModule } from './members/members.module';
import { ModeModule } from './mode/mode.module';
import { NumberHistoryModule } from './number-history/number-history.module';

@Module({
  imports: [NatsModule, RoomModule, MembersModule, RedisModule, GameModule, ModeModule, NumberHistoryModule],
})
export class AppModule {}
