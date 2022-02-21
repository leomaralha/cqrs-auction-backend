import { AggregateRoot } from '@nestjs/cqrs';
import { Expose } from 'class-transformer';
import { addMilliseconds, intervalToDuration, subMilliseconds } from 'date-fns';
import { AuctionStartEvent } from 'src/modules/auction/events/auction/auction-start.event';
import { DomainBid } from './bid';
import { DomainDuration } from './duration';
import { ICreateAuctionPayload } from '../interfaces/create-auction-payload.interface';
import { v4 as uuid } from 'uuid';
import { AuctionEndEvent } from 'src/modules/auction/events/auction/auction-ended.event';
import { AuctionNewBidEvent } from 'src/modules/auction/events/auction/aution-new-bid.event';
import { BadRequestException } from '@nestjs/common';
import { AuctionDurationChangeEvent } from 'src/modules/auction/events/auction/duration-auction-changed.event';

export class DomainAuction extends AggregateRoot {
  @Expose()
  private id: string;

  @Expose()
  private vehicleName: string;

  @Expose()
  private duration: DomainDuration;

  @Expose()
  private bids: DomainBid[];

  @Expose()
  private readonly createdAt: Date;

  @Expose()
  private startedAt?: Date;

  @Expose()
  private endedAt?: Date;

  @Expose()
  private endReason?: string;

  constructor(payload: ICreateAuctionPayload) {
    super();
    this.id = payload.id || uuid();
    this.vehicleName = payload.vehicleName;
    this.duration = payload.duration;
    this.createdAt = payload.createdAt || new Date();
    this.bids = payload.bids || [];
    this.startedAt = payload.startedAt;
    this.endedAt = payload.endedAt;
    this.endReason = payload.endReason;
  }

  start() {
    if (this.startedAt)
      throw new BadRequestException('Auction already running');
    this.startedAt = new Date();
    this.apply(
      new AuctionStartEvent({
        auctionId: this.id,
        duration: this.duration.getCurrent(),
        expectedEndTime: this.getExpectedEndTime(),
        startedAt: this.createdAt,
      }),
    );
  }

  end(reason: string) {
    debugger;
    if (this.endedAt) throw new BadRequestException('Auction already stopped');
    this.endedAt = new Date();
    this.endReason = reason;
    this.apply(
      new AuctionEndEvent({
        reason,
        auctionId: this.id,
        endedAt: this.endedAt,
        startedAt: this.createdAt,
        duration: this.duration.getCurrent(),
      }),
    );
  }

  public getEndReason(): string {
    return this.endReason;
  }

  public getId(): string {
    return this.id;
  }

  public setId(id: string): void {
    this.id = id;
  }

  public getExpectedEndTime(): Date {
    if (!this.startedAt) throw new BadRequestException('Auction is not active');
    const result = addMilliseconds(this.startedAt, this.duration.getCurrent());
    return result;
  }

  public getVehicleName(): string {
    return this.vehicleName;
  }

  public setVehicleName(vehicleName: string): void {
    this.vehicleName = vehicleName;
  }

  public getDuration(): DomainDuration {
    return this.duration;
  }

  public setDuration(duration: DomainDuration): void {
    this.duration = duration;

    this.apply(
      new AuctionDurationChangeEvent({
        auctionId: this.id,
        remainingTime: this.getRemainingTime(),
        expectedEndTime: this.getExpectedEndTime(),
      }),
    );
  }

  public getBids(): DomainBid[] {
    return this.bids;
  }

  public setBids(bids: DomainBid[]): void {
    this.bids = bids;
  }

  public getStartedAt(): Date {
    return this.startedAt;
  }

  public setStartedAt(startedAt: Date): void {
    this.startedAt = startedAt;
  }

  public newBid(newBid: DomainBid) {
    const currentWinningBid = this.getCurrentWinner();
    const isValidNewBid = currentWinningBid
      ? newBid.getValue() > currentWinningBid.getValue()
      : true;

    if (!isValidNewBid)
      throw new BadRequestException(
        'Bid amount should be greater that the last one',
      );

    this.bids.push(newBid);

    const outbidEvent: AuctionNewBidEvent = {
      id: newBid.getId(),
      auctionId: this.getId(),
      dealer: newBid.getDealer(),
      bidValue: newBid.getValue(),
      createdAt: newBid.getCreatedAt(),
      remainingTime: this.getRemainingTime(),
    };

    this.apply(new AuctionNewBidEvent(outbidEvent));
  }

  public getCurrentWinner() {
    const [currentWinningBid] = this.bids.slice(-1);
    return currentWinningBid;
  }

  public getRemainingTime() {
    return this.getExpectedEndTime().getTime() - Date.now();
  }

  public isActive() {
    return !this.endedAt && this.getExpectedEndTime() > new Date();
  }
}
