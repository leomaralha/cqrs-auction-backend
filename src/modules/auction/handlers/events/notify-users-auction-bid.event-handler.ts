import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SOCKETIO_NOTIFIER } from 'src/core/dependency-injection/auction';
import { IAuctionClientNotifier } from 'src/core/domain/auction/interfaces/auction-client-notifiers.interface';
import { AuctionNewBidEvent } from '../../events/auction/aution-new-bid.event';

@EventsHandler(AuctionNewBidEvent)
export class NotifyUsersNewBidEventHandler implements IEventHandler {
  constructor(
    @Inject(SOCKETIO_NOTIFIER)
    private notifier: IAuctionClientNotifier
    ) {}

  handle(event: AuctionNewBidEvent) {
    this.notifier.newBid(event);
  }
}
