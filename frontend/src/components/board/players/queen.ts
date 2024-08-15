import Piece from "./piece"


class Queen extends Piece{
     public getPossibleMoves(currentPos:[number,number]){
          const [x,y] = currentPos
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
          
          t = -1
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

export default Queen