import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaClient } from '@prisma/client';
import { CreateGameModeDto, CreateGameWithModeDto, FindRemoveDto, UpdateGameModeDto } from './dto';
import { RpcException } from '@nestjs/microservices';
import { RuleService } from 'src/rule/rule.service';
import { GameEntity, GameModeEntity, GameOnModeEntity, GameRuleEntity } from './entities';
import { RedisService } from 'src/redis/redis.service';
import { RedisKeys } from 'src/common/const';

@Injectable()
export class GameService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('Game-Service');
  CACHE_TTL = 30 * 60;
  private static readonly SEPARATORS = {
    MAIN: ':',
  } as const;
  
  constructor(
    private ruleServ: RuleService,
    private redisServ: RedisService
  ) { super(); }

  async onModuleInit() {
    await this.$connect();
  }

  // TODO: Game
  async create(createGameDto: CreateGameDto) {
    const game = await this.game.create({
      data: createGameDto
    });

    const keyGame = RedisKeys.GAME_ID(game.id);
    await this.redisServ.set(keyGame, game, this.CACHE_TTL);

    return game;
  }

  async createGameWithMode(payload: CreateGameWithModeDto) {
    const { eventId, gameModeId, assignedBy } = payload;
    const gameIds = await this.findByEvent(eventId);

    if (gameIds.length === 0) {
      const game = await this.create({ eventId });

      const gameOnMode = await this.createGameOnMode(game.id, assignedBy, gameModeId);

      const gameMode = await this.findOneMode(gameModeId);

      const gameRule = await this.ruleServ.findByGameMode(gameOnMode.gameModeId);

      return {
        game,
        gameOnMode,
        gameMode,
        gameRule
      }
    } else {
      let gameOnMode: GameOnModeEntity | null = null;
      for (const game of gameIds) {
        const { id } = game;
        const isActive = await this.findIsActiveByGame(id);

        if (isActive) {
          gameOnMode = isActive;
          break;
        }
      }

      if (!gameOnMode) {
        const game = await this.create({ eventId });

        const gameOnMode = await this.createGameOnMode(game.id, assignedBy, gameModeId);

        const gameMode = await this.findOneMode(gameModeId);

        const gameRule = await this.ruleServ.findByGameMode(gameOnMode.gameModeId);

        return {
          game,
          gameOnMode,
          gameMode,
          gameRule
        }
      } else {
        const game: GameEntity = await this.findOne(gameOnMode.gameId);
  
        const gameMode: GameModeEntity = await this.findOneMode(gameOnMode.gameModeId);
        
        const gameRule = await this.ruleServ.findByGameMode(gameOnMode.gameModeId);
        
        return {
          game,
          gameOnMode,
          gameMode,
          gameRule
        }
      }
    }

  }

  async findAll() {
    return await this.game.findMany({});
  }

  async findOne(id: number) {
    const keyGame = RedisKeys.GAME_ID(id);
    
    await this.getRedis(keyGame);

    const game = await this.game.findUnique({
      where: { id }
    });
    
    if (!game) throw new RpcException({
      status: HttpStatus.NOT_FOUND,
      message: `Game with id #${id} not found`
    });
    
    await this.redisServ.set(keyGame, game, this.CACHE_TTL);

    return game;
  }

  async findByEvent(eventId: number) {
    const keyGameEvent = RedisKeys.GAME_EVENT(eventId);
    
    await this.getRedis(keyGameEvent);

    const gameIds = await this.game.findMany({
      where: { eventId: eventId },
      select: {
        id: true
      }
    });

    await this.redisServ.set(keyGameEvent, gameIds, this.CACHE_TTL);

    return gameIds;
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
    const keyGame = RedisKeys.GAME_ID(id);

    const cachedGame = await this.redisServ.get(keyGame);

    if ( !cachedGame ) {
      await this.findOne(id);
    }

    const game = await this.game.update({
      where: {
        id: id
      },
      data: {
        start_time: data.start_time,
      }
    });

    await this.redisServ.set(keyGame, game, this.CACHE_TTL);
    await this.invalidateCachedGame(game.eventId);

    return game;
  }

  async remove(id: number) {
    const keyGame = RedisKeys.GAME_ID(id);
    const cachedGame = await this.redisServ.get(keyGame);

    if ( !cachedGame ) {
      await this.findOne(id);
    }

    await this.redisServ.delete(keyGame);

    const game = await this.game.delete({
      where: { id }
    });

    await this.invalidateCachedGame(game.eventId);

    return game;
  }

  async invalidateCachedGame(eventId: number) {
    const keyGameEvent = RedisKeys.GAME_EVENT(eventId);
    this.redisServ.delete(keyGameEvent);
  }

  // TODO: GameMode
  async createMode(createGameModeDto: CreateGameModeDto) {
    const gameMode = await this.gameMode.create({
      data: createGameModeDto
    });

    const keyGameMode = RedisKeys.GAME_MODE_ID(gameMode.id);
    await this.redisServ.set(keyGameMode, gameMode, this.CACHE_TTL);

    return gameMode;
  }

  async findAllMode() {
    const keyGameModeAll = RedisKeys.GAME_MODE_ALL;
    
    await this.getRedis(keyGameModeAll);

    const gameModeAll = await this.gameMode.findMany({});

    await this.redisServ.set(keyGameModeAll, gameModeAll, this.CACHE_TTL);

    return gameModeAll;
  }

  async findOneMode(id: number) {
    const keyGameMode = RedisKeys.GAME_MODE_ID(id);

    await this.getRedis(keyGameMode);

    const gameMode = await this.gameMode.findUnique({
      where: { id }
    });

    if (!gameMode) throw new RpcException(`Mode with id #${id} not found`);

    await this.redisServ.set(keyGameMode, gameMode, this.CACHE_TTL);

    return gameMode;
  }

  async findOneModeForName(name: string) {
    const mode = await this.gameMode.findFirst({
      where: {
        name: name
      }
    });

    if (!mode) throw new RpcException(`Mode with name: ${name} not found`);

    return mode;
  }

  async updateMode(updateModeDto: UpdateGameModeDto) {
    const { id, ...data } = updateModeDto;
    const keyGameMode = RedisKeys.GAME_MODE_ID(id);

    await this.findOneMode(id);

    const gameMode = await this.gameMode.update({
      where: {
        id: id
      },
      data: data
    });

    await this.redisServ.set(keyGameMode, gameMode, this.CACHE_TTL);
    await this.invalidateCachedGameMode();

    return gameMode;
  }

  async removeMode(id: number) {
    const keyGameMode = RedisKeys.GAME_MODE_ID(id);
    await this.findOneMode(id);

    await this.redisServ.delete(keyGameMode);

    return await this.gameMode.delete({
      where: { id }
    });
  }

  async invalidateCachedGameMode() {
    const keyGameModeAll = RedisKeys.GAME_MODE_ALL;
    this.redisServ.delete(keyGameModeAll);
  }

  // TODO: GameOnMode
  async createGameOnMode(gameId: number, assignedBy: string, gameModeId: number) {
    const gameOnMode = await this.gameOnMode.create({
      data: {
        gameId: gameId,
        gameModeId: gameModeId,
        is_active: true,
        assignedBy: assignedBy
      }
    });

    const keyGameOnMode = RedisKeys.GAME_ON_MODE_ID(gameOnMode.gameId, gameOnMode.gameModeId);

    await this.redisServ.set(keyGameOnMode, gameOnMode, this.CACHE_TTL);

    return gameOnMode;
  }

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
    const keyGameOnMode = RedisKeys.GAME_ON_MODE_ID(gameId, gameModeId);
    
    await this.getRedis(keyGameOnMode);

    const gameOnMode = await this.gameOnMode.findFirst({
      where: {
        gameId: gameId,
        gameModeId: gameModeId
      }
    });

    if (!gameOnMode) throw new RpcException({
      status: HttpStatus.NOT_FOUND,
      message: `Game with id #${gameId} and Mode with #${gameModeId} not found`
    });

    await this.redisServ.set(keyGameOnMode, gameOnMode, this.CACHE_TTL);

    return gameOnMode;
  }

  async removeGameOnMode(findRemoveDto: FindRemoveDto) {
    const { gameId, gameModeId } = findRemoveDto;
    const keyGameOnMode = RedisKeys.GAME_ON_MODE_ID(gameId, gameModeId);
    
    await this.findOneGameOnMode(findRemoveDto);
    
    await this.redisServ.delete(keyGameOnMode);

    return await this.gameOnMode.delete({
      where: {
        gameId_gameModeId: {
          gameId: gameId,
          gameModeId: gameModeId,
        },
      }
    });
  }

  //TODO: REDIS
  async getRedis(key: string) {
    const cachedGame = await this.redisServ.get(key);

    if (cachedGame) {
      return JSON.parse(cachedGame);
    }
  }
}
