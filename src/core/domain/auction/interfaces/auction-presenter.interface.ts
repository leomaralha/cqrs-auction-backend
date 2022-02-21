import { DomainAuction } from "../entities/auction";

export interface IAuctionPresenter<RType = any, TReturn = any> {
  createFromDomain(auction: DomainAuction): TReturn;
}