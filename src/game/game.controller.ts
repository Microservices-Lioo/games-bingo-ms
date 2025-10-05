import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GameService } from './game.service';
import { CreateGameDto, UpdateGameDto } from './dto';

@Controller()
export class GameController {
  
  constructor(private readonly gameServ: GameService) {}

  //* Obtener el ultimo juego activo de una sala
  @MessagePattern('findGameToRoom')
  findGameToRoom(@Payload('roomId', ParseUUIDPipe) roomId: string) {
    return this.gameServ.findGameToRoom(roomId);
  }

  //* Crear un juego
  @MessagePattern('createGame')
  create(@Payload() createDto: CreateGameDto) {
    return this.gameServ.create(createDto);
  }

  //* Obtener el historial de números de un juego
  @MessagePattern('getNumsGame')
  getNums(
    @Payload('roomId', ParseUUIDPipe) roomId: string,
    @Payload('gameId', ParseUUIDPipe) gameId: string,
  ) {
    return this.gameServ.getNums(roomId, gameId);
  }

  //* Actualizar un juego
  @MessagePattern('updateGame')
  update(@Payload() updateGameDto: UpdateGameDto) {
    return this.gameServ.update(updateGameDto);
  }

}
