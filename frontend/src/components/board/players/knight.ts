import Piece from "./piece"

class Knight extends Piece{

     getPossibleMoves(currentPos:[number,number]){
          let[x,y]=currentPos
          let t = -2
          for(let i = 0 ; i < 5 ; i++){
               if(t){
                    let z = t<0?(t*-1):t
                    for(let j = 0 ; j < 2;j++){
                         for(let k = 0 ; k<1;k++){
                              z = j===0?(z===2)?(z-1):(z+1):(z*-1)
                              const X = x+t
                              const Y = y-z
                              if((X>=this.lowerBound && X<=this.upperBound)&&(Y>=this.lowerBound && Y<=this.upperBound)){
                                   const piece = this.pieces[X][Y]
                                   
                                   if(piece.player && piece.type ==='remote'){
                                        this.possibleMoves.push([X,Y])
                                   }
                                   else if(!piece.player) 
                                   this.possibleMoves.push([X,Y])
                              }
                         }
                    }
               }
               t= t + 1
          }
     }

}


export default Knight
