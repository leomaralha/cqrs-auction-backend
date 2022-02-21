import { Expose } from 'class-transformer';
import { v4 } from 'uuid';
import { CreateBidPayload } from '../interfaces/create-bid-payload.interface';

export class DomainBid {
  static sortByBidAmount(a: DomainBid, b: DomainBid) {
    return a.getValue() - b.getValue();
  }

  constructor(payload: CreateBidPayload) {
    Object.assign(this, payload);
    this.id = payload.id || v4()
    this.createdAt = payload.createdAt || new Date();
  }

  @Expose()
  private id: string;

  @Expose()
  private bidder: string;

  @Expose()
  private dealer: string;

  @Expose()
  private value: number;

  @Expose()
  private readonly createdAt: Date;

  public getValue(): number {
    return this.value;
  }

  public setValue(value: number): this {
    this.value = value;
    return this;
  }

  public getId(): string {
    return this.id;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public setId(id: string): this {
    this.id = id;
    return this;
  }

  public getBidder(): string {
    return this.bidder;
  }

  public setBidder(bidder: string): this {
    this.bidder = bidder;
    return this;
  }

  public getDealer(): string {
    return this.dealer;
  }

  public setDealer(dealer: string): this {
    this.dealer = dealer;
    return this;
  }
}
