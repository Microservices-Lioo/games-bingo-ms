import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { envs } from './config';

async function bootstrap() {

  const logger = new Logger('Game-Main');

  const appTcp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: envs.PORT
      }
    }
  );

  const appRedis = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.REDIS,
      options: {
        host: envs.REDIS_HOST,
        port: envs.REDIS_PORT
      }
    }
  )

  appTcp.useGlobalPipes(
    new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    })
  );

  logger.log('MS Game running on port ' + envs.PORT);
  await Promise.all([appTcp.listen(), appRedis.listen() ]);

}
bootstrap();
