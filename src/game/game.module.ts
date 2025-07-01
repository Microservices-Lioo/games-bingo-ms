import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { RuleModule } from 'src/rule/rule.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [RuleModule, RedisModule],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
