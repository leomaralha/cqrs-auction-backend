import { DomainBid } from "../entities/bid";
import { DomainDuration } from "../entities/duration";

export interface ICreateAuctionPayload {
  id?: string;
  vehicleName: string;
  duration: DomainDuration;
  createdAt?: Date;
  bids?: DomainBid[];
  startedAt?: Date;
  endedAt?: Date;
  endReason?: string;
}
