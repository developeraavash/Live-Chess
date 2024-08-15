import Player from "./player"

class Players{
     private players: Player[]
     constructor(){
          this.players = [] 
     }
     public addPlayer(player:Player){
          this.players.push(player)
     }
     public removePlayer(id:string){
          this.players = this.players.filter(player=>player.playerId !== id)
     }
     public getPlayers():Player[]{
          return this.players
     }
     public findPlayer(id:string):Player|undefined{
          return this.players.find(({playerId})=>playerId===id)
     }
     getPlayersExceptYou(playerId:string){
          return this.players.filter((player)=>player.playerId!==playerId)
     }
}

export default Players