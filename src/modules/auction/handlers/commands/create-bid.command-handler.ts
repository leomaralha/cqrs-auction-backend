import { BadRequestException, Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AUCTION_REPOSITORY_REDIS } from 'src/core/dependency-injection/auction';
import { DomainBid } from 'src/core/domain/auction/entities/bid';
import { IAuctionRepository } from 'src/core/domain/auction/interfaces/auction-repository.interface';
import { NewBidCommand } from '../../commands/auction/new-bid.command';

@CommandHandler(NewBidCommand)
export class CreateBidCommandHandler implements ICommandHandler {
  constructor(
    @Inject(AUCTION_REPOSITORY_REDIS)
    private auctionRepository: IAuctionRepository,
    private publisher: EventPublisher,
  ) {}

  async execute(command: NewBidCommand): Promise<any> {
    const newBid = new DomainBid(command);

    const auction = this.publisher.mergeObjectContext(
      await this.auctionRepository.getAuctionById(command.auctionId),
    );

    auction.newBid(newBid);
    await this.auctionRepository.persist(auction);
    auction.commit();
  }
}
