import { Provider } from '@nestjs/common';

import { CreateAuctionCommandHandler } from './create-aution.command-handler';
import { CreateBidCommandHandler } from './create-bid.command-handler';
import { EndAuctionCommandHandler } from './end-auction.command-handler';
import { ExtendAuctionDurationCommandHandler } from './extend-auction-duration.command-handler';


export const CommandHandlers: Provider[] = [
  CreateBidCommandHandler,
  EndAuctionCommandHandler,
  CreateAuctionCommandHandler,
  ExtendAuctionDurationCommandHandler,
];
