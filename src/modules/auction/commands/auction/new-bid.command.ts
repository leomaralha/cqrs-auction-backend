interface INewBidCommandPaylod {
  auctionId: string;
  bidder: string;
  dealer: string;
  value: number;
  createdAt?: Date,
}

export class NewBidCommand implements INewBidCommandPaylod {
  public readonly auctionId: string;
  public readonly bidder: string;
  public readonly dealer: string;
  public readonly value: number;
  public readonly createdAt: Date;

  constructor(payload: INewBidCommandPaylod) {
    Object.assign(this, payload);
  }
}
