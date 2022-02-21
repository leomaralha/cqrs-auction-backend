import { BaseExceptionFilter, HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './application/websocket/socketio-adapter';
import { API_PORT } from './settings/environment';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  
  app.useWebSocketAdapter(redisIoAdapter);

  await app.listen(API_PORT);
}

bootstrap();
