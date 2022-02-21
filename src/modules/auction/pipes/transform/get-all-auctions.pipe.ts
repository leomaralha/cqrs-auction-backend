import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { IIntervalQuery } from 'src/core/domain/auction/interfaces/interval-query';
import { isNullable } from 'src/utils/array/is-nullable';
import { GetAuctionsQuery } from '../../queries/get-auctions.query';

type IncommingParams = {
  valueLower?: string;
  valueUpper?: string;
};

export class GetAllAuctionsPipe
  implements PipeTransform<IncommingParams, Promise<GetAuctionsQuery>>
{
  async transform(
    value: IncommingParams,
    _metadata: ArgumentMetadata,
  ): Promise<GetAuctionsQuery> {
    const { valueLower, valueUpper } = value;
    const limits = [valueLower, valueUpper].map((limit) => {
      const parsed = parseInt(limit);
      if (isNullable(parsed)) return null;
      return parsed;
    }) as IIntervalQuery;

    const query = new GetAuctionsQuery();
    query.value = limits;

    return query;
  }
}
