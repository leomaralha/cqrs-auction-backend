import { Provider } from '@nestjs/common';
import { NotifyUsersOnAuctionStartupEventHandler } from './notify-users-startup.event-handler';
import { NotifyUserOnAuctionEndEventHandler } from './notify-users-auction-ended.event-handler';
import { NotifyUsersNewBidEventHandler } from './notify-users-auction-bid.event-handler';
import { AuctionStartedSchedulerEventHandler } from './auction-started-scheduler.event-handler';
import { NotifyUsersExtendDurationEventHandler } from './notify-users-auction-duration-change.event-handler';

export const EventHandlers: Provider[] = [
  NotifyUsersNewBidEventHandler,
  NotifyUserOnAuctionEndEventHandler,
  AuctionStartedSchedulerEventHandler,
  NotifyUsersExtendDurationEventHandler,
  NotifyUsersOnAuctionStartupEventHandler,
];
