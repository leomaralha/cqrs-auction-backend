import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  AUCTION_PRESENTER,
  AUCTION_REPOSITORY_REDIS,
} from 'src/core/dependency-injection/auction';
import { IAuctionPresenter } from 'src/core/domain/auction/interfaces/auction-presenter.interface';
import { IAuctionRepository } from 'src/core/domain/auction/interfaces/auction-repository.interface';
import { GetAuctionsQuery } from '../../queries/get-auctions.query';

@QueryHandler(GetAuctionsQuery)
export class GetAuctionsQueryHandler implements IQueryHandler<GetAuctionsQuery> {
  constructor(
    @Inject(AUCTION_REPOSITORY_REDIS)
    private auctionRepository: IAuctionRepository,
    @Inject(AUCTION_PRESENTER)
    private auctionPresenter: IAuctionPresenter,
  ) {}

  async execute(query: GetAuctionsQuery): Promise<any> {
    const auctions = await this.auctionRepository.getAllAuctions();

    const presentationAuctions = auctions.map((auction) =>
      this.auctionPresenter.createFromDomain(auction),
    );
    
    return presentationAuctions;
  }
}
