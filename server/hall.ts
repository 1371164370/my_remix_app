import { GomokuServerSocket, ServerToClientEvents, Status } from "../types";
import { GomoguGame } from "./gomoku";

export class ServerUser {
  private _hall?: Hall;
  private _game?: GomoguGame;
  constructor(
    public id: string,
    public username: string,
    public socket: GomokuServerSocket
  ) {
  }
  get game() {
    return this._game;
  }

  joinGame(game: GomoguGame) {
    this._game = game;
    this._hall?.userStartGaming(this)
  }
  leaveGame() {
    this._game = undefined;
    this._hall?.userStopGaming(this)
  }

  // notify(serverToClientEvents: keyof ServerToClientEvents) {
  //   const hall = this._hall
  //   if (hall) {
  //     this.socket.emit(
  //       serverToClientEvents,
  //       hall.userList.map((serverUser) => ({
  //         id: serverUser.id,
  //         username: serverUser.username,
  //         status: serverUser._game
  //           ? Status.GAMING
  //           : hall.matchingUserList.includes(this)
  //             ? Status.PENDDING
  //             : Status.ONLINE,
  //       }))
  //     );
  //   }
  // }
}
type EventName = keyof ServerToClientEvents
export class Hall {

  public userListMap = { all: [] as ServerUser[], matching: [] as ServerUser[], gaming: [] as ServerUser[] }
  constructor() { }
  enterHall(curUser: ServerUser) {
    this.userListMap.all.push(curUser);
  }
  leaveHall(curUser: ServerUser) {
    const selfIdx = this.userListMap.all.findIndex(
      (serverUser) => serverUser == curUser
    );
    selfIdx != -1 && this.userListMap.all.splice(selfIdx, 1);
  }
  userStartMatching(curUser: ServerUser) {
    this.userListMap.matching.push(curUser);
  }
  userStopMatching(curUser: ServerUser) {
    const userIdx = this.userListMap.matching.findIndex(
      (serverUser) => serverUser == curUser)
    userIdx != -1 && this.userListMap.matching.splice(userIdx, 1);
  }
  userStartGaming(curUser: ServerUser) {
    this.userListMap.gaming.push(curUser);

  }
  userStopGaming(curUser: ServerUser) {
    const userIdx = this.userListMap.gaming.findIndex(
      (serverUser) => serverUser == curUser)
    userIdx != -1 && this.userListMap.gaming.splice(userIdx, 1);
  }
  boardcast(serverToClientEvents: EventName, payload: Parameters<ServerToClientEvents[EventName]>) {
    for (const user of this.userListMap.all) {
      user.socket.emit(serverToClientEvents, ...payload)
    }
  }
}


