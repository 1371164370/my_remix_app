import { BLANK, Board, Coordinate } from "./board";
import { ServerUser } from "./hall";
const enum SIG_GAME {
    NO_CHANGE, GAME_END, CONTINUE
}
export class GomoguGame {
    private _board: Board
    private _turn!: number//init in setFirstTurn
    constructor(private _players: ServerUser[], boardWidth: number, boardHeight = boardWidth) {
        for (const player of this._players) {
            player.joinGame(this)
        }
        this._board = new Board(boardWidth, boardHeight)
        this.setFirstTurn()
        this.startGame()
    }

    setFirstTurn(turnPlayer = this.whichIdxFirst()) {
        this._turn = turnPlayer
    }
    async startGame() {
        let sig = SIG_GAME.CONTINUE
        do {
            sig = await this.execTurn()
            switch (sig) {
                case SIG_GAME.CONTINUE:
                    this.MovetoNextTurn()
                    break;
                case SIG_GAME.NO_CHANGE:

                default:
                    break;
            }
        } while (sig !== SIG_GAME.GAME_END)
        this.endGame()
    }
    MovetoNextTurn() {
        this._turn = (this._turn + 1) % this._players.length
    }
    whichIdxFirst() {
        return Math.round(Math.random() * (this._players.length - 1))
    }
    getPieceTypeOfPlayer(playerIdx: number) {
        return playerIdx + 1
    }
    async execTurn(): Promise<SIG_GAME> {
        return new Promise((res, rej) => {

            const turn = this._turn
            const curPlayerEmit = this._players[turn].socket.emit
            const turn_piece = this.getPieceTypeOfPlayer(turn)

            curPlayerEmit('your_turn', (coordinate) => {
                if (this.judgeValid(coordinate)) {
                    this._board.place(coordinate, turn_piece)
                    if (this.judgeWin(coordinate, turn_piece)) {
                        res(SIG_GAME.GAME_END)
                        curPlayerEmit('alert', '你赢了')
                        this._players.forEach((_player, idx) => {
                            idx !== turn && _player.socket.emit('alert', '你输了')
                        })
                    }
                } else {
                    curPlayerEmit('alert', '无效的位置')
                    res(SIG_GAME.NO_CHANGE)
                }
            })

        })

    }
    judgeWin({ x, y }: Coordinate, occupy: number) {
        let count = 1;
        // 判断竖排是否有5个了
        if (count < 5) {
            let cy = y - 1;
            while (cy > y - 5 && cy >= 0) {
                if (this._board.getPiece(x, cy) != occupy) {
                    break;
                }
                count++;
                cy--;
            }
            cy = y + 1;
            while (cy < y + 5 && cy < this._board.height) {
                if (this._board.getPiece(x, cy) != occupy) {
                    break;
                }
                count++;
                cy++;
            }
        }

        // 判断横排是否有5个了
        if (count < 5) {
            count = 1;
            let cx = x - 1;
            while (cx > x - 5 && cx >= 0) {
                if (this._board.getPiece(cx, y) != occupy) {
                    break;
                }
                count++;
                cx--;
            }
            cx = x + 1;
            while (cx < x + 5 && cx < this._board.width) {
                if (this._board.getPiece(cx, y) != occupy) {
                    break;
                }
                count++;
                cx++;
            }
        }

        //判断左边的斜排
        if (count < 5) {
            count = 1;
            let cx = x - 1;
            let cy = y - 1
            while (cx > x - 5 && cx >= 0 && cy > y - 5 && cy >= 0) {
                if (this._board.getPiece(cx, cy) != occupy) {
                    break;
                }
                count++;
                cx--;
                cy--;
            }
            cx = x + 1;
            cy = y + 1;
            while (cx < x + 5 && cx < this._board.width && cy < y + 5 && cy < this._board.height) {
                if (this._board.getPiece(cx, cy) != occupy) {
                    break;
                }
                count++;
                cx++;
                cy++;
            }
        }

        //判断右边的斜排
        if (count < 5) {
            count = 1;
            let cx = x + 1;
            let cy = y - 1
            while (cx < x + 5 && cx < this._board.width && cy > y - 5 && cy >= 0) {
                if (this._board.getPiece(cx, cy) != occupy) {
                    break;
                }
                count++;
                cx++;
                cy--;
            }
            cx = x - 1;
            cy = y + 1;
            while (cx > x - 5 && cx >= 0 && cy < y + 5 && cy < this._board.height) {
                if (this._board.getPiece(cx, cy) != occupy) {
                    break;
                }
                count++;
                cx--;
                cy++;
            }
        }

        return count >= 5;
    }
    judgeValid({ x, y }: Coordinate) {
        return this._board.getPiece(x, y) == BLANK
    }
    endGame() {
        for (const player of this._players) {
            player.leaveGame()
            player.socket.emit('end_game')
        }
    }
}

