import { DomainAuction } from '../entities/auction';

export interface IAuctionRepository {
  getAuctionById(id: string): Promise<DomainAuction>;
  endAuction(id: string): Promise<void>;
  persist(auction: DomainAuction): Promise<void>;
  getAllAuctions(): Promise<DomainAuction[]>;
}
