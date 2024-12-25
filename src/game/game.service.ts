import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaClient } from '@prisma/client';
import { CreateGameModeDto, UpdateGameModeDto } from './dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class GameService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('Game-Service');

  async onModuleInit() {
    await this.$connect();
  }
  

  // TODO: Game
  create(createGameDto: CreateGameDto) {
    return 'This action adds a new game';
  }

  findAll() {
    return `This action returns all game`;
  }

  findOne(id: number) {
    return `This action returns a #${id} game`;
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return `This action updates a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
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

    if ( !modes ) throw new RpcException(`Mode with id #${id} not found`);

    return modes;
  }

  async findOneModeForName(name: string) {
    const modes = await this.gameMode.findFirst({
      where: {
        name: name
      }
    });

    if ( !modes ) throw new RpcException(`Mode with name: ${name} not found`);

    return modes;
  }

  async updateMode(updateGameDto: UpdateGameModeDto) {
    const { id, ...data } = updateGameDto;

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

}
