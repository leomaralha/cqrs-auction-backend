interface AuctionDurationChangeEventPayload {
    auctionId: string;
    remainingTime: number;
    expectedEndTime: Date,
  }
  
  export class AuctionDurationChangeEvent implements AuctionDurationChangeEventPayload {
    public readonly auctionId: string;
    public readonly remainingTime: number;
    public readonly expectedEndTime: Date;
    constructor(eventDescriptor: AuctionDurationChangeEventPayload) {
      Object.assign(this, eventDescriptor);
    }
  }
  