interface ICreateAuctionCommand {
  duration: number;
  vehicleName: string;
}

export class CreateAuctionCommand {
  public duration: number;
  public vehicleName: string;

  constructor(event: ICreateAuctionCommand) {
    Object.assign(this, event);
  }
}
