import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateAuctionValidator {
  @IsInt()
  @IsPositive()
  public duration: number;

  @IsString()
  @IsNotEmpty()
  public vehicleName: string;
}
