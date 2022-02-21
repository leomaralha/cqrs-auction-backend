import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { addMilliseconds } from 'date-fns';
import { AuctionStartEvent } from '../../events/auction/auction-start.event';
import { AuctionSchedulerService } from '../../services/schedulers/auction.scheduler';

@EventsHandler(AuctionStartEvent)
export class AuctionStartedSchedulerEventHandler
  implements IEventHandler<AuctionStartEvent>
{
  constructor(private scheduleService: AuctionSchedulerService) {}

  handle(event: AuctionStartEvent) {
    const expirationTime = addMilliseconds(event.startedAt, event.duration);

    this.scheduleService.scheduleAuctionEnd({
      auctionId: event.auctionId,
      endTime: expirationTime,
    });
  }
}
