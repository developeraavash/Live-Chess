import { Server, Socket } from 'socket.io';
import Match from '../model/match';
import Matches from '../model/matches';
import Player from "../model/player"
import Players from '../model/players';
import RandomMatch from '../model/random-match';
import u from '../utils';
import Events from './events';

interface ICreateMatch{
     player1:Player
     player2:Player
     matches:Matches
     cb:(match:Match,player1:Player,player2:Player,player1Socket:Socket)=>void
}
class PlayerEvent extends Events{
     player:Player
     constructor(player:Player,socket:Socket,players:Players,io:Server){
          super(socket,players,io)
          this.player = player
     }
     public leftMatch(){
          this.socket.on('leftMatch',(data)=>{
               // lefth the match
               console.log(data, 'left match')
          })
     }
     public friendlyMatchRequest(){
          this.socket.on('friendlyMatchRequest',(data)=>{
               const {opponentId} = data
               const opponent = this.players.findPlayer(opponentId)
               if(opponent){
                    this.socket.to(opponentId).emit('acceptOrRejectMatchRequest',{
                         message:`${this.player.username} ask for match request`,
                         requestedBy:this.player.playerId
                    })
               }
          })
     }
     public cancelMatchRequest(){
          this.socket.on('cancelMatchRequest',(data)=>{
               const {opponentId}= data
               this.socket.to(opponentId).emit('cancelMatchRequest')
               this.socket.to(opponentId).emit('info',{
                    message:`${this.player.username} cancels the match request`
               })
          })
     }
     createMatch(props:ICreateMatch){
          const {
               matches,
               player1,
               player2,
               cb
          } = props
          const matchId = u.generateId()
          const match = new Match(matchId,player1,player2) // create a match object
          matches.addMatch(match) // add match to the matches list
          // here randomly which one to make player1
          this.updatePlayersState(player1,player2)
          match.movementTurn = 'player1'
          const player1Id = player1.playerId
          const player1Socket = this.findSocket(player1Id)
          const player2Socket = this.socket
          if(!player1Socket) return
          // now add both player1 and player2 socket to current match room
          player1Socket.join(matchId)
          player2Socket.join(matchId)
          // create a match event using cb
          cb(match,player1,player2,player1Socket)
          console.log(this.player,'this.player after updating the player state')
          this.playerList() // emit the playerList event to update the player list 
          const playersOnMatchInfo={player1,player2}
          this.io.to(matchId).emit('startMatch',playersOnMatchInfo)
          player1Socket.emit('movePiece',{
               movementTurn:'player1'
          })
          const playersOnMatch = [
               {
                    username:player1.username,
                    type:'player1'
               },
               {
                    username:player2.username,
                    type:'player2'
               }
          ]
          this.socket.emit('matchInfo',{     
               you:playersOnMatch[1],
               opponent:playersOnMatch[0]
          })
          player1Socket.emit('matchInfo',{
               you:playersOnMatch[0],
               opponent:playersOnMatch[1]
          })
     }
     protected updatePlayersState(player1:Player,player2:Player){
          player1.state='idle'?'playing':'idle'
          player2.state='idle'?'playing':'idle'
     }
     public randomMatchRequest(matches:Matches,randomMatch:RandomMatch,cb:(match:Match,player1:Player,player2:Player,player1Socket:Socket)=>void){
          this.socket.on('randomMatchRequest',()=>{
               console.log('this is random match request')
               const playerOnWaiting = randomMatch.playerOnWaiting
               console.log(playerOnWaiting,'player on waiting')
               if(playerOnWaiting && playerOnWaiting.playerId !== this.player.playerId){
                    // instead randomly choose player1 and player2 
                    // we can choose player1 to the player who ask for first 
                    // random match request
                    const player1 = playerOnWaiting 
                    const player2 = this.player
                    this.createMatch({
                         matches,
                         player1,
                         player2,
                         cb
                    })
                    randomMatch.playerOnWaiting = null
                    randomMatch.clearPreviousRequestTimer()
                    return
                    // here clear the previous time out
               }
               else {
                    randomMatch.playerOnWaiting = this.player
                    randomMatch.startPreviousRequestTimer(()=>{
                         console.log(this.player,'this.player')
                         this.socket.emit('randomMatchRequestTimeout')
                    })
               }
               // check if there is any player waiting for random match request
               // if so, then pop the first user and start the match
               // else push the requested user to waiting list for atleast 10 sec
               // if 10 secs past, emit try again later event to the requested socket

          })
     }

     public rejectMatchRequest(){
          this.socket.on('rejectMatchRequest',(data)=>{
               const {requestedBy} = data
               this.socket.to(requestedBy).emit('info',{
                    message:`${this.player.username} reject your match request`
               })
               this.socket.to(requestedBy).emit('rejectMatchRequest',{id:this.player.playerId})
          })
     }
     public acceptMatchRequest(matches:Matches,cb:(match:Match,player1:Player,player2:Player,player1Socket:Socket)=>void){
          this.socket.on('acceptMatchRequest',(data)=>{
               const {requestedBy} = data
               const matchId = u.generateId()
               const player1 = this.players.findPlayer(requestedBy)
               const player2 = this.player
               if(!player1)
                    return     
               const match = new Match(matchId,player1,player2)
               matches.addMatch(match)
               player1.state = 'playing'
               player2.state = 'playing'
               match.movementTurn = 'player1'
               const roomSockets = this.io.of('/').sockets
               let player1Socket
               for(const [_key,socket] of roomSockets){
                    const socketRooms = socket.rooms
                    if(socketRooms?.has(requestedBy)){
                         player1Socket = socket
                         break
                    }
               }
               if(player1Socket){
                    player1Socket.join(matchId)
                    this.socket.join(matchId)
                    cb(match,player1,player2,player1Socket)
                    const data={
                         player1:{
                              id:player1.playerId,
                              username:player1.username,
                              state:player1.state
                         },
                         player2:{
                              id:player2.playerId,
                              username:player2.username,
                              state:player2.state
                              }
                    }
                    
                    player1Socket.emit('acceptMatchRequest',{id:player2.playerId})
                    
                    this.io.to(matchId).emit('startMatch',data)
                    this.socket.broadcast.emit('playerList',{
                         players:this.players.getPlayers()
                    })
                    player1Socket.emit('movePiece',{
                         movementTurn:'player1'
                    })
                    const playersOnMatch = [
                         {
                              username:player1.username,
                              type:'player1'
                         },
                         {
                              username:player2.username,
                              type:'player2'
                         }
                    ]
                    this.socket.emit('matchInfo',{
                         you:playersOnMatch[1],
                         opponent:playersOnMatch[0]
                    })
                    player1Socket.emit('matchInfo',{
                         you:playersOnMatch[0],
                         opponent:playersOnMatch[1]
                    })
               }
          })
     }
     public noMatchRequestResponse(){
          this.socket.on('noMatchRequestResponse',(data)=>{
               const {opponentId} = data
               this.socket.to(opponentId).emit('info',{
                    message:`${this.player.username} shows no response!`
               })
               this.socket.to(opponentId).emit('rejectMatchRequest',{id:this.player.playerId})
          })
     }


}

export default PlayerEvent