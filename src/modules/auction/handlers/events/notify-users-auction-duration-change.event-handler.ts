import { AuctionDurationChangeEvent } from '../../events/auction/duration-auction-changed.event';
import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SOCKETIO_NOTIFIER } from 'src/core/dependency-injection/auction';
import { IAuctionClientNotifier } from 'src/core/domain/auction/interfaces/auction-client-notifiers.interface';

@EventsHandler(AuctionDurationChangeEvent)
export class NotifyUsersExtendDurationEventHandler
  implements IEventHandler<AuctionDurationChangeEvent>
{
  constructor(
    @Inject(SOCKETIO_NOTIFIER)
    private notifier: IAuctionClientNotifier,
  ) {}

  handle(event: AuctionDurationChangeEvent) {
    this.notifier.extendDuration({
      auctionId: event.auctionId,
      duration: event.remainingTime,
      expectedEndTime: event.expectedEndTime,
    });
  }
}
