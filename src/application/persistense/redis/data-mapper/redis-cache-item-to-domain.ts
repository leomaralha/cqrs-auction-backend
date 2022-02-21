import { DomainAuction } from 'src/core/domain/auction/entities/auction';
import { DomainBid } from 'src/core/domain/auction/entities/bid';
import { DomainDuration } from 'src/core/domain/auction/entities/duration';

export function redisCacheItemToDomainAuction(redisInfo: any) {
  const auctionDuration = new DomainDuration(redisInfo.duration.current);
  const bids: DomainBid[] = redisInfo.bids.map(
    (bid) =>
      new DomainBid({
        id: bid.id,
        bidder: bid.bidder,
        dealer: bid.dealer,
        value: bid.value,
      }),
  );

  return new DomainAuction({
    bids: bids,
    id: redisInfo.id,
    duration: auctionDuration,
    vehicleName: redisInfo.vehicleName,
    endedAt: redisInfo.endedAt ? new Date(redisInfo.endedAt) : undefined,
    createdAt: redisInfo.createdAt ? new Date(redisInfo.createdAt) : undefined,
    startedAt: redisInfo.startedAt ? new Date(redisInfo.startedAt) : undefined,
  });
}
