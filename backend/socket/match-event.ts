import { Socket } from 'socket.io';
import Match from '../model/match'
import Events from './events'
import Players from '../model/players';
import { Server } from 'socket.io';
import Player from '../model/player';

type TPlayerType = 'player1'|'player2'
class MatchEvent extends Events{
     match:Match
     player:Player
     playerType:TPlayerType
     constructor(socket:Socket,player:Player,players:Players,io:Server,match:Match,playerType:TPlayerType){
          super(socket,players,io)
          this.match = match
          this.player = player
          this.playerType = playerType
     }
     public movePiece(){
          this.socket.on('movePiece',(data)=>{
               const {
                    lastPos,
                    newPos,
                    isPieceMurdered,
                    isKingMurdered,
                    playerType
               }=data
               const {player1,player2, movementTurn} = this.match
               const matchId = this.match.getMatchId
               if(isKingMurdered){
                    this.match.isKingMurdered = true
                    this.socket.to(matchId).emit('matchEnd',{
                         message:'you loss the match, better luck next time!'
                    })
                    this.socket.emit('matchEnd',{
                         message:'you win the match, congrats!'
                    })
                    // here we need to emit event to all the connected socket to inform that
                    // game is finished
                    this.resetMatch()
                    console.log(this.players.getPlayers(),'these are the players after ending match')
                    this.updatePlayerList()
                    return
                    // if(playerType==='player1' && playerType===this.playerType){
                    //      // here distinguish which one is player1 and player2

                    // }else {

                    // }
                    // now its time to end the game
                    // now remove all the sockets or player connected to this match
                    // emit the matchEnd event
               }
               if(isPieceMurdered){
                    this.match.leftPieces--
                    this.match.killedPieces++
               }
               const [lX,lY] = lastPos
               const [nX,nY]=newPos

               const newMovementTurn = movementTurn === 'player1' ? 'player2' : 'player1'
               this.match.movementTurn = newMovementTurn
               // here needs to calculate the new position using pos where pos is in the
               // form of [x,y]
               
               // here we are using room to emit the event because
               // it only emit the events for other all connected sockets except itself

               this.socket.to(matchId).emit('movePiece',{
                    lastPos:[Math.abs(7-lX),Math.abs(lY)],
                    newPos:[Math.abs(7-nX),Math.abs(nY)],
                    movementTurn:newMovementTurn
               })
               

          })
     }
     private updatePlayerList(){
          this.socket.broadcast.emit('playerList',{
               players:this.players.getPlayers()
          })
     }
     leftMatch(){
          this.socket.on('leftMatch',(data)=>{
               this.resetMatch()
               console.log(this.players.getPlayers(),'these are the players after leaving match')
               this.updatePlayerList()
               this.io.to(this.match.getMatchId).emit('leftMatch',{
                    message:`${this.player.username} left the match`
               })
          })
     }
     private resetMatch(){
          this.match.player1.state = 'idle'
          this.match.player2.state = 'idle'
          this.socket.removeAllListeners('movePiece')
          this.socket.removeAllListeners('leftMatch')
          const myId = this.player.playerId
          const opponent = [this.match.player1,this.match.player2]
          .find((player)=>player.playerId !== myId)
          if(opponent){
               const opponentSocket = this.findSocket(opponent.playerId)
               opponentSocket?.removeAllListeners('movePiece')
               opponentSocket?.removeAllListeners('leftMatch')
          }
     }

}

export default MatchEvent