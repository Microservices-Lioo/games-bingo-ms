import { Module } from '@nestjs/common';
import { GameModule } from './game/game.module';
import { RuleModule } from './rule/rule.module';
import { BallCalledModule } from './ball-called/ball-called.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [GameModule, RuleModule, BallCalledModule, RedisModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
