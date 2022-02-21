import { Provider } from '@nestjs/common';
import { AuctionBidSaga } from './auction-bid.saga';

export const Sagas: Provider[] = [AuctionBidSaga];
