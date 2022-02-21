import { Store } from 'cache-manager';
import * as _RedisStoreFactory from 'cache-manager-redis-store';
import { RedisClientType } from 'redis';
import { redisConfig } from 'src/settings/environment';
import { Cache as _Cache } from 'cache-manager';

interface RedisStore extends Store {
  name: 'redis';
  getClient: () => RedisClientType;
  isCacheableValue: (value: any) => boolean;
}

export class RedisStoreFactory {
  static create(): RedisStore {
    const store = _RedisStoreFactory.create(redisConfig);
    return store;
  }
}

export interface Cache extends _Cache {
  store: RedisStore;
}

export const redisStore = RedisStoreFactory.create();
