import { BadRequestException, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob, CronTime } from 'cron';
import { format } from 'date-fns';
import { AUCTION_REPOSITORY_REDIS } from 'src/core/dependency-injection/auction';
import { IAuctionRepository } from 'src/core/domain/auction/interfaces/auction-repository.interface';
import { EndAuctionCommand } from '../../commands/auction/end-auction.command';

type ScheduleAuction = { auctionId: string; endTime: Date };

@Injectable()
export class AuctionSchedulerService implements OnModuleInit {
  private readonly logger = new Logger(AuctionSchedulerService.name);

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    @Inject(AUCTION_REPOSITORY_REDIS)
    private auctionRepository: IAuctionRepository,
    private commandBus: CommandBus,
  ) {}

  onModuleInit() {
    return this.scheduleAllAuctions();
  }

  private async scheduleAllAuctions() {
    const auctions = await this.auctionRepository.getAllAuctions();

    const proms = auctions.map((auction) =>
      this.scheduleAuctionEnd({
        auctionId: auction.getId(),
        endTime: auction.getExpectedEndTime(),
      }),
    );

    await Promise.all(proms);
  }

  public scheduleAuctionEnd(schedule: ScheduleAuction) {
    const expirationTime = schedule.endTime;
    const expirerFn = this.createExpirer(schedule);

    const auctionExpirerJob = new CronJob(expirationTime, expirerFn);

    this.schedulerRegistry.addCronJob(schedule.auctionId, auctionExpirerJob);

    auctionExpirerJob.start();

    this.logger.log(
      `Auction [SCHEDULE-START] [${schedule.auctionId}] - ${format(
        expirationTime,
        'd/M/yyyy h:m:s',
      )}`,
    );
  }

  public changeAuctionExpirationTime(auctionId: string, newEndTime: Date) {
    const auctionExpirerJob = this.schedulerRegistry.getCronJob(auctionId);
    if(!auctionExpirerJob) throw new BadRequestException('Auction aldready finished');

    const cronTime = new CronTime(newEndTime)
    auctionExpirerJob.setTime(cronTime);
    auctionExpirerJob.start();

    console.log('Auction timer changeg to: ', newEndTime);
  }

  private createExpirer(event: ScheduleAuction) {
    return async () => {
      const auctionExpirerJob = this.schedulerRegistry.getCronJob(
        event.auctionId,
      );

      auctionExpirerJob.stop();

      await this.commandBus.execute(
        new EndAuctionCommand({
          auctionId: event.auctionId,
          reason: `Ended by ${AuctionSchedulerService.name}`,
        }),
      );

      this.logger.log(
        `Auction [SCHEDULE-END] [${event.auctionId}] - ${format(
          event.endTime,
          'd/M/yyyy h:m:s',
        )}`,
      );
    };
  }
}
