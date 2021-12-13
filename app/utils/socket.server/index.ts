import { Server } from "socket.io";

import { GomokuServer, GomokuServerSocket, Status } from "~/types";
console.log("runinng");
const io = new Server() as GomokuServer;

io.use((socket, next) => {});
io.on("connection", (socket) => {
  console.log("connected", socket.id);
});
console.log("before listen");
io.listen(3500);

export class ServerUser {
  public hall = hall;
  private _game?: GomoguGame;
  constructor(
    public id: string,
    public username: string,
    public socket: GomokuServerSocket
  ) {
    this.enterHall();
  }
  get game() {
    return this._game;
  }
  set game(game: GomoguGame | undefined) {
    !!game !== !!this._game && this.notify();
    if (!game) {
    }
    this._game = game;
  }
  enterHall() {
    this.hall.userList.push(this);
  }
  leaveHall() {
    const selfIdx = this.hall.userList.findIndex(
      (serverUser) => serverUser == this
    );
    selfIdx != -1 && this.hall.userList.splice(selfIdx, 1);
  }
  joinGame(game: GomoguGame) {
    this.game = game;
  }
  leaveGame() {
    this.game = undefined;
  }
  startPendding() {
    this.hall.penddingUserList.push(this);
  }
  endPendding() {
    const selfIdx = this.hall.penddingUserList.findIndex(
      (serverUser) => serverUser == this
    );
    selfIdx != -1 && this.hall.penddingUserList.splice(selfIdx, 1);
  }
  notify() {
    this.socket.emit(
      "user_list_change",
      this.hall.userList.map((serverUser) => ({
        id: serverUser.id,
        username: serverUser.username,
        status: serverUser._game
          ? Status.GAMING
          : this.hall.penddingUserList.includes(this)
          ? Status.PENDDING
          : Status.ONLINE,
      }))
    );
  }
}

class Hall {
  public readonly userList: ServerUser[] = [];
  public readonly penddingUserList: ServerUser[] = [];
  constructor() {}
}
export const hall = new Hall();
