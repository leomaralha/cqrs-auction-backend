interface IEndAuctionCommand {
    auctionId: string;
    reason: string;
  }
  
  export class EndAuctionCommand {
    auctionId: string;
    reason: string;
  
    constructor(event: IEndAuctionCommand) {
      Object.assign(this, event);
    }
  }
  