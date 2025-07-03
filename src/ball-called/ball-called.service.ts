import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateBallCalledDto } from './dto/create-ball-called.dto';
import { NumberRaffleDto } from './dto';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class BallCalledService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('Ball Called Service Connected');

  async onModuleInit() {
    await this.$connect();
  }

  async create(createBallCalledDto: CreateBallCalledDto) {
    try {
      const ball_called = await this.ballsCalled.create({
        data: createBallCalledDto
      });

      return ball_called;
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        name: 'create',
        message: error.message
      })
    }
  }

  async findOneByGameId(gameId: number) {
    try {
      const called_balls = await this.ballsCalled.findMany({
        where: {
          gameId
        },
        select: { num: true }
      });

      return called_balls;
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        name: 'findOneByGameId',
        message: error.message
      });
    }
  }

  async unrepeatableTableNumberRaffle(numberRanffle: NumberRaffleDto) {
    try {
      const { gameId } = numberRanffle;
      const inicio = 0;
      const limite = 75;

      const calledBalls = await this.findOneByGameId(gameId);

      if (calledBalls.length === 0) {
        const numberRandom = await this.numberRandom(inicio, limite);
        const columnName = await this.columnIdentification(numberRandom);

        return await this.create({ gameId, num: numberRandom, colName: columnName });
      }

      const arrayCalledNums = calledBalls.map(({num}) => num );

      const numberRandom = await this.unrepeatableRandomNumber(arrayCalledNums, inicio, limite);

      if (!numberRandom) {
        return null;
      }
      const columnName = await this.columnIdentification(numberRandom);
      return await this.create({ gameId, num: numberRandom, colName: columnName });
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        name: 'unrepeatableTableNumberRaffle',
        message: error.message
      });
    }
  }

  
  private async numberRandom(inicio: number, limite: number): Promise<number> {
    this.validateRange(inicio, limite, 'numberRandom');
    return Math.floor(Math.random() * (limite - inicio + 1)) + inicio;
  }

  private async unrepeatableRandomNumber(calledNums: number[], inicio: number, limite: number): Promise<number|null> {
    if (calledNums.length == 0) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        name: 'unrepeatableRandomNumber',
        message: 'La lista de números llamados está vacia'
      });
    }

    this.validateRange(inicio, limite, 'unrepeatableRandomNumber');

    const totalNumeros = limite - inicio + 1;
    
    if (calledNums.length >= totalNumeros) {
      return null;
    }

    const setUsados = new Set(calledNums);

    let numeroGenerado: number;

    do {
      numeroGenerado = Math.floor(Math.random() * totalNumeros) + inicio;
    } while(setUsados.has(numeroGenerado));


    return numeroGenerado;
  }

  private validateRange(inicio: number, limite: number, nameMethod: string): void {
    if (!Number.isInteger(inicio) || !Number.isInteger(limite)) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        name: nameMethod,
        message: 'Los parametros deben ser numeros enteros'
      });
    }

    if (inicio > limite) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        name: nameMethod,
        message: 'El valor de inicio debe ser menor al límite'
      });
    }
  }

  private async columnIdentification(num: number): Promise<string> {
    if (num > 0 && num <= 15 ) {
      return `B`;
    } else if (num >= 16 && num <= 30) {
      return `I`;
    } else if (num >= 31 && num <= 45) {
      return `N`;
    } else if (num >= 46 && num <= 60) {
      return `G`;
    } else if (num >= 61 && num <= 75) {
      return `O`;
    } else {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        name: 'columnIdentification',
        message: 'El valor excedio el rango final'
      });
    }
  }
}
