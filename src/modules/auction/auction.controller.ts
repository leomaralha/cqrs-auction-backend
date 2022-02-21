import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateAuctionCommand } from './commands/auction/new-auction.command';
import { NewBidCommand } from './commands/auction/new-bid.command';
import { GetAllAuctionsPipe } from './pipes/transform/get-all-auctions.pipe';
import { CreateAuctionValidator } from './pipes/validation/create-auction.validator';
import { CreateBidValidator } from './pipes/validation/create-bi';
import { GetAuctionByIdQuery } from './queries/get-auction.query';
import { GetAuctionsQuery } from './queries/get-auctions.query';

@Controller('/auction')
export class AuctionController {
  constructor(private queryBus: QueryBus, private commandBus: CommandBus) {}

  @Get()
  async getAllAuctions(@Query(GetAllAuctionsPipe) query: GetAuctionsQuery) {
    return this.queryBus.execute(query);
  }

  @Get(':id')
  async getAcutionById(@Param('id') id: string) {
    const query = new GetAuctionByIdQuery({ auctionId: id });
    return this.queryBus.execute(query);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createAuction(@Body() auctionStartInfo: CreateAuctionValidator) {
    const createAuctionCommand = new CreateAuctionCommand({
      duration: auctionStartInfo.duration,
      vehicleName: auctionStartInfo.vehicleName,
    });

    const data = await this.commandBus.execute(createAuctionCommand);
    return data;
  }

  @Post('/bid')
  @UsePipes(ValidationPipe)
  async makeBid(@Body() bidInfo: CreateBidValidator){
    await this.commandBus.execute(new NewBidCommand(bidInfo))
  }
}
