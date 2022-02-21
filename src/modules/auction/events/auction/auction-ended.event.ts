interface IAuctionStartEventPayload {
  auctionId: string;
  endedAt: Date;
  startedAt: Date;
  duration: number;
  reason: string;
}

export class AuctionEndEvent implements IAuctionStartEventPayload {
  public readonly auctionId: string;
  public readonly endedAt: Date;
  public readonly startedAt: Date;
  public readonly duration: number;
  public readonly reason: string;
  constructor(eventDescriptor: IAuctionStartEventPayload) {
    Object.assign(this, eventDescriptor);
  }
}
