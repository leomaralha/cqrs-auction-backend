export interface CreateBidPayload {
  id?: string;
  bidder: string;
  dealer: string;
  value: number;
  createdAt?: Date;
}
