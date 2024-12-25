import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { CreateGameModeDto, UpdateGameModeDto } from './dto';

@Controller()
export class GameController {
  constructor(private readonly gameService: GameService) {}

  // TODO: Game
  @MessagePattern('createGame')
  create(@Payload() createGameDto: CreateGameDto) {
    return this.gameService.create(createGameDto);
  }

  @MessagePattern('findAllGame')
  findAll() {
    return this.gameService.findAll();
  }

  @MessagePattern('findOneGame')
  findOne(@Payload() id: number) {
    return this.gameService.findOne(id);
  }

  @MessagePattern('updateGame')
  update(@Payload() updateGameDto: UpdateGameDto) {
    return this.gameService.update(updateGameDto.id, updateGameDto);
  }

  @MessagePattern('removeGame')
  remove(@Payload() id: number) {
    return this.gameService.remove(id);
  }

  // TODO: GameMode
  @MessagePattern('createMode')
  createMode(@Payload() createModeDto: CreateGameModeDto) {
    return this.gameService.createMode(createModeDto);
  }

  @MessagePattern('findAllMode')
  findAllMode() {
    return this.gameService.findAllMode();
  }

  @MessagePattern('findOneMode')
  findOneMode(@Payload() id: number) {
    return this.gameService.findOneMode(id);
  }

  @MessagePattern('findOneModeForName')
  findOneModeForName(@Payload() name: string) {
    return this.gameService.findOneModeForName(name);
  }

  @MessagePattern('updateMode')
  updateMode(@Payload() updateModeDto: UpdateGameModeDto) {
    console.log(updateModeDto);
    return this.gameService.updateMode(updateModeDto);
  }

  @MessagePattern('removeMode')
  removeMode(@Payload() id: number) {
    return this.gameService.removeMode(id);
  }
}
