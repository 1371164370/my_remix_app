import type { Server, Socket as ServerSocket } from "socket.io";
import type { Socket as ClientSocket } from "socket.io-client";

export const enum Status {
  ONLINE,
  GAMING,
  PENDDING,
}

export interface User {
  id: string;
  username: string;
  status: Status;
}

interface ServerToClientEvents {
  user_list_change: (useList: User[]) => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  hello: () => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}
export type GomokuClientSocket = ClientSocket<
  ServerToClientEvents,
  ClientToServerEvents
>;
export type GomokuServerSocket = ServerSocket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
export type GomokuServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
