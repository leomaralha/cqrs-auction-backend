import { Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AUCTION_REPOSITORY_REDIS } from 'src/core/dependency-injection/auction';
import { DomainAuction } from 'src/core/domain/auction/entities/auction';
import { DomainDuration } from 'src/core/domain/auction/entities/duration';
import { IAuctionRepository } from 'src/core/domain/auction/interfaces/auction-repository.interface';
import { CreateAuctionCommand } from '../../commands/auction/new-auction.command';

@CommandHandler(CreateAuctionCommand)
export class CreateAuctionCommandHandler implements ICommandHandler {
  constructor(
    @Inject(AUCTION_REPOSITORY_REDIS)
    private auctionRepository: IAuctionRepository,
    private publisher: EventPublisher,
  ) {}

  async execute(command: CreateAuctionCommand): Promise<any> {
    const auctionDuration = new DomainDuration(command.duration);
    const auction = this.publisher.mergeObjectContext(
      new DomainAuction({
        duration: auctionDuration,
        vehicleName: command.vehicleName,
      }),
    );

    auction.start();
    await this.auctionRepository.persist(auction);
    
    auction.commit();
  }
}
