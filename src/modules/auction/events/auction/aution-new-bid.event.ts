interface AuctionNewBidEventPayload {
  id: string;
  auctionId: string;
  bidValue: number;
  dealer: string;
  createdAt: Date;
  remainingTime: number;
}

export class AuctionNewBidEvent implements AuctionNewBidEventPayload {
  public readonly id: string;
  public readonly auctionId: string;
  public readonly bidValue: number;
  public readonly dealer: string;
  public readonly createdAt: Date;
  public readonly remainingTime: number;
  constructor(eventDescriptor: AuctionNewBidEventPayload) {
    Object.assign(this, eventDescriptor);
  }
}
