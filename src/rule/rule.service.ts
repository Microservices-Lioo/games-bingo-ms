import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class RuleService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('Rule-Service');

  async onModuleInit() {
    await this.$connect();
  }
  
  async create(createRuleDto: CreateRuleDto) {
    return await this.gameRule.create({
      data: createRuleDto
    })
  }

  async findAll() {
    return await this.gameRule.findMany({});
  }

  async findOne(id: number) {
    const rule = await this.gameRule.findUnique({
      where: {
        id
      }
    });

    if ( !rule ) throw new RpcException({
      status: HttpStatus.NOT_FOUND,
      message: `Rule with id ${id} not found`
    });

    return rule;
  }

  async findByGameMode(gameModeId: number) {
    const rule = await this.gameRule.findUnique({
      where: {
        gameModeId: gameModeId
      }
    });

    if ( !rule ) throw new RpcException({
      status: HttpStatus.NOT_FOUND,
      message: `Rule with game mode id #${gameModeId} not found`
    });

    return rule;
  }

  async update(updateRuleDto: UpdateRuleDto) {
    const { id, ...data } = updateRuleDto;

    await this.findOne(id);

    return await this.gameRule.update({
      where: {
        id: id
      },
      data: data
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return await this.gameRule.delete({
      where: { id }
    });
  }
}
