import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SOCKETIO_NOTIFIER } from 'src/core/dependency-injection/auction';
import { IAuctionClientNotifier } from 'src/core/domain/auction/interfaces/auction-client-notifiers.interface';
import { AuctionEndEvent } from '../../events/auction/auction-ended.event';

@EventsHandler(AuctionEndEvent)
export class NotifyUserOnAuctionEndEventHandler implements IEventHandler {
  private readonly logger = new Logger(NotifyUserOnAuctionEndEventHandler.name);
  constructor(
    @Inject(SOCKETIO_NOTIFIER)
    private notifier: IAuctionClientNotifier,
  ) {}

  handle(event: AuctionEndEvent) {
    this.notifier.auctionEnd(event);
  }
}
