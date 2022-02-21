import type { RedisClientOptions } from 'redis';
import { CacheModule, Module } from '@nestjs/common';
import { AuctionModule } from './modules/auction/auction.module';
import { redisStore } from './utils/redis-store-factory';

@Module({
  imports: [
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      store: redisStore,
      socket: {
        host: 'redis',
        port: 6379,
      },
    }),
    AuctionModule,
  ],
})
export class AppModule {}
