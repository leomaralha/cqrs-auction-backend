interface IGetAuctionByIdQueryPayload {
  auctionId: string;
}

export class GetAuctionByIdQuery implements IGetAuctionByIdQueryPayload {
  public readonly auctionId: string;
  constructor(eventDescriptor: IGetAuctionByIdQueryPayload) {
    Object.assign(this, eventDescriptor);
  }
}
