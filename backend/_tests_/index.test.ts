// import Piece from "./piece"


class Rook{

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
               for(let i = temp[it];i>=0 && i<=7;i=i+1*(t)){
                    if(it>1){
                         console.log([x,i])
                    }else {
                         console.log([i,y])
                    }
               }
          }
     }
     
}
const rook = new Rook()
rook.getPossibleMoves([2,4])
export default Rook