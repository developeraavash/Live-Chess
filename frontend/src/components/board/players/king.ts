import u from "../../../utils";
import Piece from "./piece";



class King extends Piece{
     public getPossibleMoves(currentPos:[number,number]){
          // here possible moves are [i-1,j-1] [i-1,j] [i-1,j+1]
          // [i,j-1] [i,j] [i,j+1]
          // [i+1,j-1] [i+1,j] [i+1,j+1]
          let iCounter = 0
          let jCounter = 0
          const [x,y] = currentPos 
          for(let i = x - 1 ;u.gte(i,this.lowerBound) && u.lte(iCounter,2);i++){
               jCounter = 0
               for(let j = y - 1;u.lte(j,this.upperBound) && u.lte(jCounter,2) ;j++){
                    if((i>=this.lowerBound && i<=this.upperBound) && (j>=this.lowerBound && j<=this.upperBound)){
                         const piece = this.pieces[i][j]
                         if(piece.player){
                              if(piece.type==='remote'){
                                   this.possibleMoves.push([i,j])
                              }

                         }
                         else this.possibleMoves.push([i,j])
                    }
                    jCounter++
               }
               iCounter++
          }
     }  
}

export default King

