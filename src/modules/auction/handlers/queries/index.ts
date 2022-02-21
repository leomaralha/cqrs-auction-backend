import { Provider } from '@nestjs/common';
import { GetAuctionQueryHandler } from './get-auction.query-handler';
import { GetAuctionsQueryHandler } from './get-auctions.query-handler';

export const QueryHandlers: Provider[] = [
  GetAuctionsQueryHandler,
  GetAuctionQueryHandler,
];
