import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { envs } from 'src/config';
import { JoinDto, RouletteWinnerDto } from './dtos';
import { EStatusTableBingo, HostActivity } from './enums';
import { ITableBingo } from './interfaces';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger('REDIS SERVICE')

    private client: Redis;

    onModuleInit() {
        this.client = new Redis({
            host: envs.REDIS_HOST,
            port: envs.REDIS_PORT
        });
        this.client.flushall();
    }

    onModuleDestroy() {
        this.client.flushall();
        this.client.quit();
    }

    async joinRoom(payload: JoinDto) {
        const { roomId, socketId, userId} = payload;
        try {
            // agrego al usuario a la lista de usuario conectados
            await this.set(userId, socketId);

            // agrego al usuario a la sala
            await this.client.sadd(roomId, userId);

            // agrego la sala registrada para este usuario
            await this.client.sadd(`rooms/${userId}`, roomId)
            return true;
        } catch (error) {
            this.logger.error(error);
            return false;
        }
    }

    async exitRoom(payload: JoinDto) {
        const { roomId, userId} = payload;
        try {
            // eliminar al usuario a la sala
            await this.client.srem(roomId, userId);

            await this.exitWs(userId, roomId);
            return true;
        } catch (error) {
            this.logger.error(error);
            return false;
        }
    }

    async exitWs(userId: string, roomId: string) {
        try {
            // obtener las salas donde esta registrado el usuario
            const rooms = await this.client.smembers(`rooms/${userId}`);

            if (rooms.length === 0 || rooms.length === 1) {
                await this.client.del(`rooms/${userId}`);
                return true;
            }

            // elimino solo la sala
            await this.client.srem(`rooms/${userId}`, roomId);
            return true;
        } catch (error) {
            this.logger.error(error);
            return false;
        }
    }

    async countUsersToRoom(roomId: string) {
        try {
            const count = await this.client.scard(roomId);
            return count;
        } catch (error) {
            this.logger.error(error);
            return 0;
        }
    }

    async startCount(roomId: string, durationMs: number) {
        try {
            const endTime = Date.now() + durationMs;
            const durationSec = Math.ceil(durationMs / 1000);
            
            const data = { endTime, duration: durationMs };
            const key = `rooms:${roomId}:count`;
            await this.client.set(key, JSON.stringify(data), 'EX', durationSec);
            return data;
        } catch (error) {
            this.logger.error(error);
            return null;
        }
    }

    async getStartCount(roomId: string) {
        try {
            const key = `rooms:${roomId}:count`;
            const count = await this.client.get(key);

            if (!count) {
                return null;
            }

            return JSON.parse(count);
        } catch (error) {
            this.logger.error(error);
            return null;
        }
    }

    async saveSingBingo(socketId: string, roomId: string, userId: string, cardId: string, fullnames: string) {
        const key = `rooms:${roomId}:tablebingo`;
        const data = {
            socketId,
            userId,
            cardId,
            fullnames,
            status: EStatusTableBingo.PENDIENTE
        }

        try {
            const sings = await this.getSingBingo(roomId);

            if (!sings) {
                await this.client.set(key, JSON.stringify([data]));
            } else {
                const exists = sings.find(s => s.cardId === cardId);
                if(!exists) {
                    sings.push(data);
                }
                await this.client.set(key, JSON.stringify(sings));
            }

            return await this.getSingBingo(roomId);
        } catch (error) {
            this.logger.error(error);
            return null;
        }
    }

    async getSingBingo(roomId: string): Promise<ITableBingo[]> {
        const key = `rooms:${roomId}:tablebingo`;
        try {
            const data = await this.client.get(key);
            if (!data) return null;

            return JSON.parse(data);
        } catch (error) {
            this.logger.error(error);
            return null;
        }
    }

    async updateSingBingo(roomId: string, cardId: string, status: EStatusTableBingo) {
        const key = `rooms:${roomId}:tablebingo`;
        const data = await this.getSingBingo(roomId);

        if (!data) return null;

        const sing = data.find(d => d.cardId === cardId);

        if (!sing) {
            return null;
        }

        const update = data.map(d => d.cardId === cardId ? {...d, status: status}: d);
        let newData: ITableBingo[];

        if (status === EStatusTableBingo.RECHAZADO) {
            newData = update.filter(d => d.cardId != cardId);
        }

        try {
            await this.client.set(key, JSON.stringify(newData || update));
            return {
                sing: {
                    ...sing,
                    status: status
                },
                table: newData || update
            };
        } catch (error) {
            this.logger.error(error);
            return null;
        }
    }

    async cleanTableBingo(roomId: string) {
        const key = `rooms:${roomId}:tablebingo`;
        try {
            const data = await this.client.del(key);
            if (data === 0) return false;

            return true;
        } catch (error) {
            this.logger.error(error);
            return false;
        }
    }

    async getHostActivity(roomId: string) {
        const key = `rooms:${roomId}:activityHost`;
        try {
            const data = await this.client.get(key);
            if (!data) return HostActivity.ESPERANDO;

            return data;
        } catch (error) {
            this.logger.error(error);
            return HostActivity.ESPERANDO;
        }
    }

    async updateHostActivity(roomId: string, status: HostActivity) {
        const key = `rooms:${roomId}:activityHost`;
        try {
            const data = await this.client.set(key, status);
            if (!data) return false;

            return true;
        } catch (error) {
            this.logger.error(error);
            return false;
        }
    }

    async get(key: string) {
        try {
            const data = await this.client.get(key);
            if (!data) return null;

            return JSON.parse(data);
        } catch (error) {
            this.logger.error(error);
            return null;
        }
    }

    async set(key: string, otp: any, ttInSeconds?: number) {
        const data = JSON.stringify(otp);
        if (ttInSeconds) {
            const result = await this.client.set(key, data, 'EX', ttInSeconds);
            if (!result) return null;
            return result;
        } else {
            const result = await this.client.set(key, data);
            if (!result) return null;
            return result;
        }
    }
}
