import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { envs } from 'src/config';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client: Redis;

    onModuleInit() {
        this.client = new Redis({
            host: envs.REDIS_HOST,
            port: envs.REDIS_PORT
        })
    }

    onModuleDestroy() {
        this.client.quit();
    }

    async set(key: string, otp: Object, ttInSeconds?: number): Promise<void> {
        const data = JSON.stringify(otp);
        if (ttInSeconds) {
            await this.client.set(key, data, 'EX', ttInSeconds);
        } else {
            await this.client.set(key, data);
        }
    }

    async get(key: string): Promise<string | null> {
        return await this.client.get(key);
    }

    async delete(key: string): Promise<number> {
        return await this.client.del(key);
    }
}
