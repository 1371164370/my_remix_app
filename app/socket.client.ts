import { io } from "socket.io-client";
import { useStore } from "./models";
import { GomokuClientSocket } from "./types";

export const socket = io("http://localhost:3500") as GomokuClientSocket;

socket.on("connect", () => {
  const [_, { setSocket }] = useStore("SocketModel");
  setSocket(socket);
});

socket.on("disconnect", () => {
  const [_, { setSocket }] = useStore("SocketModel");
  setSocket(undefined);
});
