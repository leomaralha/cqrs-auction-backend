import { AuctionNewBidEvent } from 'src/modules/auction/events/auction/aution-new-bid.event';
import { AuctionEndEvent } from 'src/modules/auction/events/auction/auction-ended.event';
import { AuctionStartEvent } from 'src/modules/auction/events/auction/auction-start.event';

export type ExtendAuctionDuration = {
  auctionId: string;
  duration: number;
  expectedEndTime: Date;
};

export interface IAuctionClientNotifier {
  newBid(event: AuctionNewBidEvent): void;
  auctionEnd(event: AuctionEndEvent): void;
  auctionStart(event: AuctionStartEvent): void;
  extendDuration(event: ExtendAuctionDuration): void;
}
