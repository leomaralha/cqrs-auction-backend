import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBidValidator {
  @IsString()
  @IsNotEmpty()
  bidder: string;

  @IsString()
  @IsNotEmpty()
  dealer: string;

  @IsNotEmpty()
  @Type(() => Number)
  value: number;

  @IsString()
  @IsNotEmpty()
  auctionId: string;
}
