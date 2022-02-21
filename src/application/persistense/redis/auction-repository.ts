import { DomainAuction } from 'src/core/domain/auction/entities/auction';
import { IAuctionRepository } from 'src/core/domain/auction/interfaces/auction-repository.interface';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { AUCTION_STORE_NAME_PREFIX } from 'src/settings/environment';
import { instanceToPlain } from 'class-transformer';
import { redisCacheItemToDomainAuction } from './data-mapper/redis-cache-item-to-domain';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheAuctionRepository implements IAuctionRepository {
  static RUNNING_AUCTIONS_KEY = `running_auctions`;
  constructor(
    @Inject(CACHE_MANAGER)
    private cache: Cache,
  ) {}

  async getAllAuctions(): Promise<DomainAuction[]> {
    const auctionsIds = await this.getCurrentAuctionsIds();
    const auctionsPromises = [...auctionsIds].map((auctionId) => {
      return this.getAuctionById(auctionId);
    });

    const auctions = await Promise.all(auctionsPromises);
    return auctions.filter(auction => auction.isActive());
  }

  private getKeyFromId(auctionId: string) {
    return `${AUCTION_STORE_NAME_PREFIX}:${auctionId}`;
  }

  private async getCurrentAuctionsIds() {
    const runningAuctionsStr = await this.cache.get<string>(
      CacheAuctionRepository.RUNNING_AUCTIONS_KEY,
    );
    const auctionsIds: string[] = runningAuctionsStr?.split(',') || [];
    return new Set(auctionsIds);
  }

  private async addAuctionToIndex(auctionIds: string[]) {
    const currentAuctions = await this.getCurrentAuctionsIds();
    auctionIds.forEach((id) => currentAuctions.add(id));
    const auctionsStr = [...currentAuctions].join(',');

    await this.cache.set(
      CacheAuctionRepository.RUNNING_AUCTIONS_KEY,
      auctionsStr,
      { ttl: 0 },
    );
  }

  private async removeAuctionFronIndex(ids: string[]) {
    const currentAuctions = await this.getCurrentAuctionsIds();
    ids.forEach((id) => currentAuctions.delete(id));

    const auctionsStr = [...currentAuctions].join(',');

    await this.cache.set(
      CacheAuctionRepository.RUNNING_AUCTIONS_KEY,
      auctionsStr,
      { ttl: 0 },
    );
  }

  async getAuctionById(id: string): Promise<DomainAuction> {
    const stringAuction = await this.cache.get<string>(this.getKeyFromId(id));
    if (!stringAuction) return null;

    const rawAuction = JSON.parse(stringAuction);
    return redisCacheItemToDomainAuction(rawAuction);
  }

  async endAuction(id: string): Promise<void> {
    await this.cache.del(this.getKeyFromId(id));
    await this.removeAuctionFronIndex([id]);
  }

  async persist(auction: DomainAuction): Promise<void> {
    const auctionId = auction.getId();
    const cacheKey = this.getKeyFromId(auctionId);
    const plainAuction = instanceToPlain(auction, {
      excludeExtraneousValues: true,
    });

    const stringAuction = JSON.stringify(plainAuction);

    await this.addAuctionToIndex([auctionId]);
    await this.cache.set(cacheKey, stringAuction, { ttl: 0 });
  }
}
