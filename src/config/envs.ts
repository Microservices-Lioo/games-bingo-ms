import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    DATABASE_URL: string;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_DB: string;
    REDIS_HOST: string;
    REDIS_PORT: number;
    NATS_SERVERS: string[];
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    POSTGRES_USER: joi.string().required(),
    POSTGRES_PASSWORD: joi.string().required(),
    POSTGRES_DB: joi.string().required(),
    REDIS_HOST: joi.string().required(),
    REDIS_PORT: joi.string().required(),
    NATS_SERVERS: joi.array().items( joi.string() ).required(),
})
.unknown(true);

const { error, value } = envsSchema.validate( {
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS?.split(',')
} );

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs: EnvVars = {
    PORT: envVars.PORT,
    DATABASE_URL: envVars.DATABASE_URL,
    POSTGRES_USER: envVars.POSTGRES_USER,
    POSTGRES_PASSWORD: envVars.POSTGRES_PASSWORD,
    POSTGRES_DB: envVars.POSTGRES_DB,
    REDIS_HOST: envVars.REDIS_HOST,
    REDIS_PORT: envVars.REDIS_PORT,
    NATS_SERVERS: envVars.NATS_SERVERS
}
