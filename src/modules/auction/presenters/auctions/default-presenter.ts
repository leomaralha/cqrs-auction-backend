import { Injectable } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { DomainAuction } from 'src/core/domain/auction/entities/auction';
import { IAuctionPresenter } from 'src/core/domain/auction/interfaces/auction-presenter.interface';

@Injectable()
export class DefaultAuctionPresenter
  implements IAuctionPresenter<Record<string, any>, Record<string, any>>
{
  createFromDomain(auction: DomainAuction): Record<string, any> {
    const instance = instanceToPlain(auction, { excludeExtraneousValues: true });
    instance.expectedEndTime = auction.getExpectedEndTime();
    return instance;
  }
}
