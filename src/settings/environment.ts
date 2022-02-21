import * as env from 'env-var';

export const API_PORT = env.get('API_PORT').required().asPortNumber();
export const REDIS_HOST = env.get('REDIS_HOST').required().asString();

export const AUCTION_INCREASE_TIME = env
  .get('AUCTION_INCREASE_TIME')
  .default(30000)
  .asIntPositive();

export const AUCTION_STORE_NAME_PREFIX = env
  .get('AUCTION_STORE_NAME_PREFIX')
  .default('auctions')
  .asString();

export const AUCTION_THERESHOLD_INCREASE_TIME = env
  .get('AUCTION_THERESHOLD_INCREASE_TIME')
  .default(60000)
  .asIntPositive();

export const REDIS_DB = env.get('REDIS_DB').required().asIntPositive();
export const REDIS_PORT = env.get('REDIS_PORT').required().asPortNumber();
export const REDIS_CACHE_TTL = env
  .get('REDIS_CACHE_TTL')
  .required()
  .asIntPositive();

export const REDIS_URI = `redis://${REDIS_HOST}:${REDIS_PORT}/${REDIS_DB}`;

export const redisConfig = {
  db: REDIS_DB,
  host: REDIS_HOST,
  port: REDIS_PORT,
  ttl: REDIS_CACHE_TTL,
  name: 'redis',
};
