import Player from "./player"


// this must be circular queue
class PlayerQueue{
     private players:Player[]
     private size:number
     private front:number
     private top:number
     constructor(){
          this.players = []
          this.front = -1
          this.top = -1
          this.size = 5
     }
     public enqueuePlayer(){
          if(this.front === -1 && this.top === -1){
               this.front = 0
               this.top = 0
          }
          if(this.front === 0 && this.top === this.size - 1){
               console.log('queue overflow')
               return
          }


     }
     public dequeuPlayer(){

     }
     public isEmpty():boolean{
          return false
     }
     public isFull():boolean{
          return false
     }
}

export default PlayerQueue