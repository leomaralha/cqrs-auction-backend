import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {
  AUCTION_INCREASE_TIME,
  AUCTION_THERESHOLD_INCREASE_TIME,
} from 'src/settings/environment';
import { ExtendAuctionDurationCommand } from '../commands/auction/extend-auction-duration.command';
import { AuctionNewBidEvent } from '../events/auction/aution-new-bid.event';

@Injectable()
export class AuctionBidSaga {
  @Saga()
  auctionBidExtendTime = (events$: Observable<any>): Observable<ICommand> => {
    const isInLastTimeBid = (event: AuctionNewBidEvent) => {
      return event.remainingTime < AUCTION_THERESHOLD_INCREASE_TIME;
    };

    return events$.pipe(
      ofType(AuctionNewBidEvent),
      filter(isInLastTimeBid),
      map(
        (event) =>
          new ExtendAuctionDurationCommand({
            auctionId: event.auctionId,
            durationIncrease: AUCTION_INCREASE_TIME,
          }),
      ),
    );
  };
}
