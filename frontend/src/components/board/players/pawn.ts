import Piece from "./piece"

class Pawn extends Piece{
     public getPossibleMoves(currentPos: TCurrentPos): void {
          const[x,y]=currentPos
          let piece = this.pieces[x-1][y]
          if((x-1) >= this.lowerBound && !piece.player){
               this.possibleMoves.push([x-1,y])
          }    
          piece = this.pieces[x-1][y-1]
          if((x-1)>=this.lowerBound && (y-1)>=this.lowerBound && piece.player && piece.type==='remote')
               this.possibleMoves.push([x-1,y-1])

          piece = this.pieces[x-1][y+1]
          if((x-1)>=this.lowerBound && (y+1)<=this.upperBound && piece.player && piece.type==='remote')
               this.possibleMoves.push([x-1,y+1])

     }
}


export default Pawn