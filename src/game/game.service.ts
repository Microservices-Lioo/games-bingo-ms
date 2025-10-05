import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { PrismaClient } from '@prisma/client';
import { UpdateGameDto } from './dto';

@Injectable()
export class GameService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('Game-Service');
  
  constructor() { super(); }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected')
  }

  async create(createGameDto: CreateGameDto) {
    return await this.game.create({
      data: createGameDto
    });
  }

  async findGameToRoom(roomId: string) {
    const game = await this.game.findFirst({
      where: { roomId: roomId, end_time: null }
    });

    if (!game) {
      return null;
    }

    return game;
  }

  async getNums(roomId: string, gameId: string) {
    const game = await this.game.findFirst({
      where: { id: gameId, roomId }
    });

    if (!game || !game.numberHistoryId) {
      return null;
    }

    const nums = await this.numberHistory.findFirst({
      where: { id: game.numberHistoryId }
    });
    return nums;
  }

  async update(dto: UpdateGameDto) {
    const { id, ...data } = dto;
    const game = await this.game.update({
      where: { id },
      data
    });
    return game;
  }
}
