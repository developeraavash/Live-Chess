

class Match{
     host:string
     remote:string
     startAt:string
     piecesDie:number
     piecesLive:number
     endAt:string
     movementTurn:typeof this.host | typeof this.remote
     constructor(host:string,remote:string){
          this.host = host
          this.remote = remote
          this.startAt = ''
          this.endAt = ''
          this.piecesLive = 32
          this.piecesDie = 0
          this.movementTurn = ''
     }
}

export default Match