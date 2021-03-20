import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

/**
 * Socket State Service Class
 */
@Injectable()
export class SocketStateService {
  /**
   * States mapper
   */
  private state = new Map<string, Socket[]>();

  /**
   * Destroy client
   * @param {string} profile
   * @param {string} socket
   */
  public destroy(profile: string, socket: Socket): boolean {
    const existing = this.state.get(profile);

    if (!existing) return true;

    const sockets = existing.filter((s) => s.id !== socket.id);

    if (!sockets.length) {
      this.state.delete(profile);
    } else {
      this.state.set(profile, sockets);
    }

    return true;
  }

  /**
   * Add client
   * @param {string} profile
   * @param {Socket} socket
   */
  public add(profile: string, socket: Socket): boolean {
    const existing = this.state.get(profile) || [];

    const sockets = [...existing, socket];

    this.state.set(profile, sockets);

    return true;
  }

  /**
   * Get specific client
   * @param {string} profile
   */
  public get(profile: string): Socket[] {
    return this.state.get(profile) || [];
  }

  /**
   * Retrieve all clients
   */
  public all(): Socket[] {
    const all = [];

    this.state.forEach((sockets) => all.push(sockets));

    return all;
  }
}
