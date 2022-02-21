interface IAuctionStartEventPayload {
  auctionId: string;
  expectedEndTime: Date;
  startedAt: Date;
  duration: number;
}

export class AuctionStartEvent implements IAuctionStartEventPayload {
  public auctionId: string;
  public expectedEndTime: Date;
  public startedAt: Date;
  public duration: number;
  constructor(eventDescriptor: IAuctionStartEventPayload) {
    Object.assign(this, eventDescriptor);
  }
}
