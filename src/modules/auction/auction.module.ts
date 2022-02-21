import { CacheModule, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheAuctionRepository } from 'src/application/persistense/redis/auction-repository';
import {
  AUCTION_PRESENTER,
  AUCTION_REPOSITORY_REDIS,
  SOCKETIO_NOTIFIER,
} from 'src/core/dependency-injection/auction';
import { AuctionController } from './auction.controller';
import { CommandHandlers } from './handlers/commands';
import { EventHandlers } from './handlers/events';
import { QueryHandlers } from './handlers/queries';
import { DefaultAuctionPresenter } from './presenters/auctions/default-presenter';
import { Sagas } from './sagas';
import { AuctionWebsocketService } from './services/notifiers/auction-ws.service';
import { AuctionSchedulerService } from './services/schedulers/auction.scheduler';

const InjectedProviders: Provider[] = [
  {
    provide: AUCTION_REPOSITORY_REDIS,
    useClass: CacheAuctionRepository,
  },
  {
    provide: AUCTION_PRESENTER,
    useClass: DefaultAuctionPresenter,
  },
  {
    provide: SOCKETIO_NOTIFIER,
    useClass: AuctionWebsocketService,
  },
];

@Module({
  imports: [CqrsModule, ScheduleModule.forRoot()],
  controllers: [AuctionController],
  providers: [
    ...Sagas,
    ...QueryHandlers,
    ...EventHandlers,
    ...CommandHandlers,
    ...InjectedProviders,
    AuctionSchedulerService,
  ],
})
export class AuctionModule {}
