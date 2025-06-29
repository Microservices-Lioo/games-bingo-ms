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

}
