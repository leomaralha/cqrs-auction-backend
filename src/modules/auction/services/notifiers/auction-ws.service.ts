import {
  ExtendAuctionDuration,
  IAuctionClientNotifier,
} from 'src/core/domain/auction/interfaces/auction-client-notifiers.interface';
import { AuctionEndEvent } from '../../events/auction/auction-ended.event';
import { AuctionStartEvent } from '../../events/auction/auction-start.event';
import { AuctionNewBidEvent } from '../../events/auction/aution-new-bid.event';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuctionSocketEvents } from '../../enums/socket-events.enum';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AuctionWebsocketService implements IAuctionClientNotifier {
  @WebSocketServer()
  server: Server;

  newBid(event: AuctionNewBidEvent): void {
    this.server.emit(AuctionSocketEvents.bid, event);
  }
  auctionEnd(event: AuctionEndEvent): void {
    this.server.emit(AuctionSocketEvents.end, event);
  }
  auctionStart(event: AuctionStartEvent): void {
    this.server.emit(AuctionSocketEvents.start, event);
  }

  extendDuration(event: ExtendAuctionDuration): void {
    console.log("Extend duration")
    this.server.emit(AuctionSocketEvents.extendDuration, event);
  }
}
