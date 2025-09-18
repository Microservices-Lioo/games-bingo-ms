import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateDto } from './dtos';

@Injectable()
export class MembersService extends PrismaClient implements OnModuleInit {
    private logger = new Logger("MEMBERS SERVICE")

    async onModuleInit() {
        await this.$connect();
        this.logger.log("Database connected");
    }

    async create(data: CreateDto) {
        await this.members.create({
            data: data
        });
        return 'Se asignó el rol para la sala de juego';
    }
}
