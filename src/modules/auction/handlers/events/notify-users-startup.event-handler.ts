import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SOCKETIO_NOTIFIER } from 'src/core/dependency-injection/auction';
import { IAuctionClientNotifier } from 'src/core/domain/auction/interfaces/auction-client-notifiers.interface';
import { AuctionStartEvent } from '../../events/auction/auction-start.event';

@EventsHandler(AuctionStartEvent)
export class NotifyUsersOnAuctionStartupEventHandler implements IEventHandler {
  private readonly logger = new Logger(NotifyUsersOnAuctionStartupEventHandler.name);
  constructor(
    @Inject(SOCKETIO_NOTIFIER)
    private notifier: IAuctionClientNotifier
    ) {}

  handle(event: AuctionStartEvent) {
    this.notifier.auctionStart(event);
    this.logger.log(
      `Auction ${event.auctionId} started. expected end time ${event.expectedEndTime}.`,
    );
  }
}
