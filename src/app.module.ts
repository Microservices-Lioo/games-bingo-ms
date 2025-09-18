import { Module } from '@nestjs/common';
// import { GameModule } from './game/game.module';
// import { RuleModule } from './rule/rule.module';
// import { BallCalledModule } from './ball-called/ball-called.module';
// import { RedisModule } from './redis/redis.module';
import { NatsModule } from './transport/nats.module';
import { RoomModule } from './room/room.module';
import { MembersModule } from './members/members.module';

@Module({
  imports: [NatsModule, RoomModule, MembersModule],
  // imports: [GameModule, RuleModule, BallCalledModule, RedisModule, NatsModule, RoomModule, MembersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
