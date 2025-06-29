import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { RuleModule } from 'src/rule/rule.module';

@Module({
  imports: [RuleModule],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
