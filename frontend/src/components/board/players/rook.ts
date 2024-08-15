import Piece from "./piece"


class Rook extends Piece{
     getPossibleMoves(currentPos:[number,number]){
          const[x,y]=currentPos
          let yB = false
          let xB = false
          let t = -1
          const temp = [x-1,x+1,y-1,y+1]
          for(let it = 0 ; it < 4;it++){
               if(it%2===0){
                    t = -1
               }else 
               t = 1
               for(let i = temp[it];i>=this.lowerBound && i<=this.upperBound;i=i+(1*(t))){
                    if(xB&&yB) break
                    if(it>1 && !yB){
                         const piece = this.pieces[x][i]
                         if(piece.player){
                              if(piece.type==='remote'){
                                   this.possibleMoves.push([x,i])
                              }
                              yB=true
                         }
                         else this.possibleMoves.push([x,i])
                    }else if(!xB && it<2){
                         const piece = this.pieces[i][y]
                         if(piece.player){
                              if(piece.type==='remote'){
                                   this.possibleMoves.push([i,y])
                              }
                              xB=true
                         }
                         else this.possibleMoves.push([i,y])
                    }
               }
               yB=false
               xB=false
          }
     }
     
}
export default Rook