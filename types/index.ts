import type { Server, Socket as ServerSocket } from "socket.io";
import type { Socket as ClientSocket } from "socket.io-client";
import { Coordinate } from "../server/board";

export type Nullable<T> = T | null
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

export interface ServerToClientEvents {
  user_list_change: (useList: User[]) => void;
  alert: (message: string) => void;
  your_turn: (callback: (coordinate: Coordinate) => void) => void;
  coutinue: (message: string, cb: (coutinue: boolean) => void) => void;
  init_game: () => void
  end_game: () => void
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
