import { Module } from '@nestjs/common';
import { GameModule } from './game/game.module';
import { RuleModule } from './rule/rule.module';
import { NumsSungModule } from './nums-sung/nums-sung.module';

@Module({
  imports: [GameModule, RuleModule, NumsSungModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
