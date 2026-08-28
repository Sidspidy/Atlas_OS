import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class StateGateway {
  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('atlas:state-update')
  handleStateUpdate(@MessageBody() data: { state: string }) {
    this.server.emit('atlas:state-changed', data);
    return { event: 'atlas:state-update', data };
  }
}
