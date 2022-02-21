import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  AUCTION_PRESENTER,
  AUCTION_REPOSITORY_REDIS,
} from 'src/core/dependency-injection/auction';
import { IAuctionPresenter } from 'src/core/domain/auction/interfaces/auction-presenter.interface';
import { IAuctionRepository } from 'src/core/domain/auction/interfaces/auction-repository.interface';
import { GetAuctionByIdQuery } from '../../queries/get-auction.query';

@QueryHandler(GetAuctionByIdQuery)
export class GetAuctionQueryHandler
  implements IQueryHandler<GetAuctionByIdQuery>
{
  constructor(
    @Inject(AUCTION_REPOSITORY_REDIS)
    private auctionRepository: IAuctionRepository,
    @Inject(AUCTION_PRESENTER)
    private auctionPresenter: IAuctionPresenter,
  ) {}

  async execute({ auctionId }: GetAuctionByIdQuery): Promise<any> {
    const auction = await this.auctionRepository.getAuctionById(auctionId);
    return this.auctionPresenter.createFromDomain(auction);
  }
}
