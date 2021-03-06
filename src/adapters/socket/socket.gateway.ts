import { Inject } from '@nestjs/common';
import { Logger } from 'winston';
import * as io from 'socket.io';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';

/**
 * Import local objects
 */
import { ConfigService } from '../../modules/config/config.service';

/**
 * Current config
 * @type {ConfigService}
 */
const config: ConfigService = new ConfigService('.env');

/**
 * Socket Gateway Class
 */
@WebSocketGateway((config.get('WEBSOCKET_PORT') as unknown) as number, {
  pingInterval: (config.get('WEBSOCKET_PING_INTERVAL') as unknown) as number,
  pingTimeout: (config.get('WEBSOCKET_PING_TIMEOUT') as unknown) as number,
  path: config.get('WEBSOCKET_PATH'),
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  /**
   * IO Server
   */
  @WebSocketServer() server: io.Server;

  /**
   * Constructor of Socket Gateway Class
   * @param {Logger} logger Logger Service
   */
  constructor(@Inject('winston') private readonly logger: Logger) {}

  /**
   * Handle server init
   * @param {any} server
   */
  afterInit(server: any) {
    this.logger.info(`[Socket] -> Init`);
  }

  /**
   * Handle client connection
   * @param {io.Socket} client
   */
  public async handleConnection(client: io.Socket) {
    this.logger.info(`[Socket] -> Connect ${client.id}`);

    try {
      return this.server.emit('event', client.id);
    } catch (error) {
      this.logger.error(
        `[Socket] -> Error \n${error.message} - handleConnection`,
      );
      return;
    }
  }

  /**
   * Handle client disconnection
   * @param {io.Socket} client
   */
  public async handleDisconnect(client: io.Socket) {
    this.logger.info(`[Socket] -> Disconnect ${client.id}`);

    try {
      return this.server.emit('event', { disconnected: client.id });
    } catch (error) {
      this.logger.error(
        `[Socket] -> Error \n${error.message} - handleDisconnect`,
      );
      return;
    }
  }
}
