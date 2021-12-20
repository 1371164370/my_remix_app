export interface Coordinate {
    x: number
    y: number
}
type SquareOccupy = number //zero represent blank
export const BLANK = 0
export const OUT_OF_BOUND = -1
export class Board {
    public squaresOccupy: SquareOccupy[]
    constructor(public width: number, public height: number) {
        this.squaresOccupy = Array.from(new Int8Array(width * height))
    }
    init() {
        this.squaresOccupy = Array.from(new Int8Array(this.width * this.height))
    }
    //这里可以用装饰器来校验坐标
    public place(coordinate: Coordinate, occupy: SquareOccupy) {
        this.squaresOccupy[this._coordinate2index(coordinate)] = occupy
    }
    getPiece(x: number, y: number) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return OUT_OF_BOUND
        }
        return this.squaresOccupy[this._coordinate2index({ x, y })]
    }
    /**
     *   
     *  |
     *  |
     * y|
     *  |
     *  |______x_______->
     */
    private _index2coordinate(idx: number): Coordinate {
        const y = parseInt(String(idx / this.width))
        const x = (idx % this.width)
        return { x, y }
    }
    private _coordinate2index({ x, y }: Coordinate): number {

        return y * this.width + x
    }
}

