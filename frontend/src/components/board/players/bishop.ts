import Piece from "./piece"

class Bishop extends Piece{
     public getPossibleMoves(currentPos:[number,number]){
          const [x,y] = currentPos
          let t = -1
          for(let i=0;i<2;i++){
               let a = x
               let b = y
               let c = y
               let forb = false
               let forc = false
               for(;;){
                    a = a+(1*t)
                    b=b-1
                    c=c+1
                    if(((a>this.upperBound||a<this.lowerBound)||(b>this.upperBound||b<this.lowerBound)) && 
                    ((a>this.upperBound||a<this.lowerBound)||(c>this.upperBound||c<this.lowerBound)))
                    break
                    if(!((a>this.upperBound||a<this.lowerBound)||(b>this.upperBound||b<this.lowerBound))){
                         const piece = this.pieces[a][b]
                         if(piece.player&&!forb){
                              if(piece.type==='remote'){
                                   this.possibleMoves.push([a,b])
                              }
                              forb = true
                         }else if(!forb) 
                         this.possibleMoves.push([a,b])
                    }
                    if(!((a>this.upperBound||a<this.lowerBound)||(c>this.upperBound||c<this.lowerBound))){
                         const piece = this.pieces[a][c]
                         if(piece.player&&!forc){
                              if(piece.type==='remote'){
                                   this.possibleMoves.push([a,c])
                              }
                              forc = true
                         }
                         else if(!forc)
                         this.possibleMoves.push([a,c])
                    }
               }
               t = 1
          }
     }
}

export default Bishop