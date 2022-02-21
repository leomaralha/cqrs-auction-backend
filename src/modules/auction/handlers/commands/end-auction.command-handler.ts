import { Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AUCTION_REPOSITORY_REDIS } from 'src/core/dependency-injection/auction';
import { IAuctionRepository } from 'src/core/domain/auction/interfaces/auction-repository.interface';
import { EndAuctionCommand } from '../../commands/auction/end-auction.command';

@CommandHandler(EndAuctionCommand)
export class EndAuctionCommandHandler
  implements ICommandHandler<EndAuctionCommand, Promise<any>>
{
  constructor(
    @Inject(AUCTION_REPOSITORY_REDIS)
    private auctionRepository: IAuctionRepository,
    private publisher: EventPublisher,
  ) {}

  async execute(command: EndAuctionCommand): Promise<any> {
    const auction = this.publisher.mergeObjectContext(
      await this.auctionRepository.getAuctionById(command.auctionId)
    );

    auction.end(command.reason);
    await this.auctionRepository.persist(auction);
    auction.commit();

    return auction;
  }
}
