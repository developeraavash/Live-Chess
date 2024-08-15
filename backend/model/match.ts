import Player from "./player"


class Match{
     private matchId:string
     player1:Player
     player2:Player
     status:'start'|'end'
     movementTurn:'player1'|'player2'
     totalPieces:number
     leftPieces:number
     killedPieces:number
     isKingMurdered:boolean
     constructor(matchId:string,player1:Player,player2:Player){
          this.matchId = matchId
          this.player1 = player1
          this.player2 = player2
          this.status='start'
          this.movementTurn = 'player1'
          this.totalPieces = 32
          this.leftPieces = 32
          this.killedPieces = 0
          this.isKingMurdered = false

     }
     get getMatchId():string{
          return this.matchId
     }
}

export default Match