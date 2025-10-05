import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateModeDto } from './dtos';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ModeService extends PrismaClient implements OnModuleInit {
    private logger = new Logger('MODE SERVICE')

    async onModuleInit() {
        await this.$connect();    
        this.logger.log("Database connected");
    }

    async create(createMode: CreateModeDto) {
        return await this.mode.create({
            data: createMode
        });
    }

    async findAll() {
        return await this.mode.findMany({});
    }

    async findOne(modeId: string) {
        const mode = await this.mode.findFirst({
            where: { id: modeId }
        });

        if (!mode) throw new RpcException({
            status: HttpStatus.NOT_FOUND,
            message: 'El modo de juego no existe'
        });
        return mode;
    }
}
