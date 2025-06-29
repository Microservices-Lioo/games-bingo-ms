import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaClient } from '@prisma/client';
import { CreateGameModeDto, FindRemoveDto, UpdateGameModeDto } from './dto';
import { RpcException } from '@nestjs/microservices';
import { RuleService } from 'src/rule/rule.service';

@Injectable()
export class GameService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('Game-Service');

  constructor(
    private ruleServ: RuleService
  ) { super(); }

  async onModuleInit() {
    await this.$connect();
  }

  // TODO: Game
  async create(createGameDto: CreateGameDto) {
    const { gameModeId, assignedBy, ...createGame } = createGameDto;
    const game = await this.game.create({
      data: createGame
    });

    const gameOnMode = await this.gameOnMode.create({
      data: {
        gameId: game.id,
        gameModeId: gameModeId,
        assignedBy: assignedBy
      }
    });

    return gameOnMode;
  }

  async findAll() {
    return await this.game.findMany({});
  }

  async findOne(id: number) {
    const game = await this.game.findUnique({
      where: { id }
    });

    if (!game) throw new RpcException({
      status: HttpStatus.NOT_FOUND,
      message: `Game with id #${id} not found`
    });

    return game;
  }

  async dataGame(eventId: number) {
    const game = await this.game.findFirst({
      where: {
        eventId: eventId
      }
    });

    if (!game) {
      return null;
    }

    //* Game on mode
    const gameOnMode = await this.findIsActiveByGame(game.id);

    if (!gameOnMode) {
      return null;
    }

    //* GameMode
    const gameMode = await this.findOneMode(gameOnMode.gameModeId);

    //* Game Rule
    const gameRule = await this.ruleServ.findByGameMode(gameOnMode.gameModeId);
    
    return { 
      game,
      gameOnMode,
      gameMode,
      gameRule
    };
  }

  async update(updateGameDto: UpdateGameDto) {
    const { id, ...data } = updateGameDto;

    await this.findOne(id);

    return await this.game.update({
      where: {
        id: id
      },
      data: {
        start_time: data.start_time,
      }
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return await this.game.delete({
      where: { id }
    });
  }

  // TODO: GameMode
  async createMode(createGameModeDto: CreateGameModeDto) {
    return await this.gameMode.create({
      data: createGameModeDto
    });
  }

  async findAllMode() {
    return await this.gameMode.findMany({});
  }

  async findOneMode(id: number) {
    const modes = await this.gameMode.findUnique({
      where: { id }
    });

    if (!modes) throw new RpcException(`Mode with id #${id} not found`);

    return modes;
  }

  async findOneModeForName(name: string) {
    const modes = await this.gameMode.findFirst({
      where: {
        name: name
      }
    });

    if (!modes) throw new RpcException(`Mode with name: ${name} not found`);

    return modes;
  }

  async updateMode(updateModeDto: UpdateGameModeDto) {
    const { id, ...data } = updateModeDto;

    await this.findOneMode(id);

    return await this.gameMode.update({
      where: {
        id: id
      },
      data: data
    });
  }

  async removeMode(id: number) {
    await this.findOneMode(id);

    return await this.gameMode.delete({
      where: { id }
    });
  }

  // TODO: GameOnMode
  async findIsActiveByGame(gameId: number) {
    const gameOnMode = await this.gameOnMode.findFirst({
      where: {
        gameId: gameId,
        is_active: true,
      }
    });

    return gameOnMode;
  }
  
  async findOneGameOnMode(findRemoveDto: FindRemoveDto) {
    const { gameId, gameModeId } = findRemoveDto;
    const game = await this.gameOnMode.findFirst({
      where: {
        gameId: gameId,
        gameModeId: gameModeId
      }
    });

    if (!game) throw new RpcException({
      status: HttpStatus.NOT_FOUND,
      message: `Game with id #${gameId} and Mode with #${gameModeId} not found`
    });

    return game;
  }

  async removeGameOnMode(findRemoveDto: FindRemoveDto) {
    const { gameId, gameModeId } = findRemoveDto;
    
    await this.findOneGameOnMode(findRemoveDto);

    return await this.gameOnMode.delete({
      where: {
        gameId_gameModeId: {
          gameId: gameId,
          gameModeId: gameModeId,
        },
      }
    });
  }

}
