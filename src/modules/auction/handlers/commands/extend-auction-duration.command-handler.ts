import { Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AUCTION_REPOSITORY_REDIS } from 'src/core/dependency-injection/auction';
import { IAuctionRepository } from 'src/core/domain/auction/interfaces/auction-repository.interface';
import { ExtendAuctionDurationCommand } from '../../commands/auction/extend-auction-duration.command';
import { AuctionSchedulerService } from '../../services/schedulers/auction.scheduler';

@CommandHandler(ExtendAuctionDurationCommand)
export class ExtendAuctionDurationCommandHandler implements ICommandHandler {
  constructor(
    @Inject(AUCTION_REPOSITORY_REDIS)
    private auctionRepository: IAuctionRepository,
    private publisher: EventPublisher,
    private auctionSchedulerService: AuctionSchedulerService,
  ) {}
  async execute(command: ExtendAuctionDurationCommand): Promise<any> {
    const auction = this.publisher.mergeObjectContext(
      await this.auctionRepository.getAuctionById(command.auctionId),
    );

    const auctionDuration = auction.getDuration();
    auctionDuration.increaseCurrentDuration(command.durationIncrease);
    auction.setDuration(auctionDuration);

    this.auctionSchedulerService.changeAuctionExpirationTime(
      auction.getId(),
      auction.getExpectedEndTime(),
    );

    await this.auctionRepository.persist(auction);
    auction.commit();
  }
}
