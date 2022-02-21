interface IExtendAuctionDurationCommand {
  auctionId: string;
  durationIncrease: number;
}

export class ExtendAuctionDurationCommand {
  public readonly auctionId: string;
  public readonly durationIncrease: number;

  constructor(event: IExtendAuctionDurationCommand) {
    Object.assign(this, event);
  }
}
