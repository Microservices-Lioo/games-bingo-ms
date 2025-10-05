import { Controller, ParseIntPipe, ParseUUIDPipe } from '@nestjs/common';
import { NumberHistoryService } from './number-history.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class NumberHistoryController {
  constructor(private readonly numberHistoryService: NumberHistoryService) { }

  @MessagePattern('getNumberHistoryGame')
  getNumberHistory(@Payload('id', ParseUUIDPipe) id: string) {
    return this.numberHistoryService.getNumberHistory(id);
  }

  //* Actualizar el historial de numeros cantados
  @EventPattern('updateHistoryGame')
  updateHistory(
    @Payload('id', ParseUUIDPipe) id: string,
    @Payload('num', ParseIntPipe) num: number,
  ) {
    return this.numberHistoryService.updateHistory(id, num);
  }

  //* Crear un historial de números
  @MessagePattern('createHistoryGame')
  createHistory(
    @Payload('gameId', ParseUUIDPipe) gameId: string
  ) {
    return this.numberHistoryService.createHistory(gameId);
  }
}
