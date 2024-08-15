import Player from "./player"



class RandomMatch{
     playerOnWaiting:Player|null
     previousRequestTimer:any
     constructor(){
          this.playerOnWaiting = null
          this.previousRequestTimer = null
     }
     clearPreviousRequestTimer(){
          clearTimeout(this.previousRequestTimer)
     }
     startPreviousRequestTimer(cb:()=>void){
          this.previousRequestTimer = setTimeout(()=>{
               cb()
               this.clearPreviousRequestTimer()
          },10000)
     }
}

export default RandomMatch