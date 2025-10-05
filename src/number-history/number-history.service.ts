import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { envs } from 'src/config';

@Injectable()
export class NumberHistoryService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger('Number History Service');

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Database connected');
    }

    async getNumberHistory(id: string) {
        const data = await this.numberHistory.findFirst({
            where: { id }
        });

        return data;
    }

    async createHistory(gameId: string) {
        const num = Math.floor(Math.random() * envs.MAX_NUMBER_BINGO) + 1;
        const numberHistory = await this.numberHistory.create({
            data: {
                nums: [num]
            }
        });

        await this.game.update({
            where: { id: gameId },
            data: { numberHistoryId: numberHistory.id }
        })
        return numberHistory.nums;
    }

    async updateHistory(id: string, num: number) {
        return await this.numberHistory.update({
            where: { id },
            data: {
                nums: {
                    push: num
                }
            }
        });
    }
}
