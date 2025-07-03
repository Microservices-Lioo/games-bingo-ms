import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BallCalledService } from './ball-called.service';
import { NumberRaffleDto } from './dto';

@Controller()
export class BallCalledController {
  constructor(private readonly ballCalledService: BallCalledService) {}

  @MessagePattern('unrepeatableTableNumberRaffle')
  unrepeatableTableNumberRaffle(@Payload() numberRanffle: NumberRaffleDto ) {
    return this.ballCalledService.unrepeatableTableNumberRaffle(numberRanffle)
  }

  @MessagePattern('findOneByGameId')
  findOneByGameId(@Payload() gameId: number) {
    return this.ballCalledService.findOneByGameId(gameId);
  }

}
