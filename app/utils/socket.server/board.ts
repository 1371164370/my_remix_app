export interface Coordinate {
    x:number
    y:number
}
const enum SquareOccupy{BLANK,P1,P2}

export class Board{
    public squaresOccupy:SquareOccupy[]
    constructor(public width:number,public height=width){
        this.squaresOccupy=Array.from(new Int8Array(width*height))
    }
    //这里可以用装饰器来校验坐标
    public place(coordinate:Coordinate,occupy:SquareOccupy){
        this.squaresOccupy[this._coordinate2index(coordinate)]=occupy
    }
    /**
     *   
     *  |
     *  |
     * y|
     *  |
     *  |______x_______->
     */
    private _index2coordinate(idx:number):Coordinate{
        const y = parseInt(String(idx/this.width))
        const x = (idx%this.width)
        return  {x,y}
    }
    private _coordinate2index({x,y}:Coordinate):number{
        
        return y*this.width+x
    }
}

