import { Server, Socket } from 'socket.io';
import Match from '../model/match';
import Player from '../model/player';
import PlayerList from '../model/players';
import Matches from '../model/matches';
import u from '../utils'
import Players from '../model/players';

class Events {
     io:Server
     socket:Socket
     players:PlayerList
     constructor(socket:Socket,playersList:PlayerList,io:Server){
          this.socket = socket
          this.players = playersList
          this.io = io
     }
     public createPlayer(cb:(player:Player,players:Players)=>void){
          this.socket.on('createPlayer',({username})=>{
               const isPlayerNameAlreadyExist = this.players.getPlayers().some(({username:playerName})=>playerName===username)
               if(isPlayerNameAlreadyExist){
                    this.socket.emit('error',{
                         message:'Username already exist!',
                         type:'username already exist'
                    })
               }else {
                    const playerId = u.generateId()
                    const oldPlayers = [...this.players.getPlayers()]
                    const players = this.players.getPlayers()
                    const player = new Player(playerId,username)
                    this.players.addPlayer(player)
                    this.socket.join(playerId)
                    this.socket.emit('playerCreated',{
                         players:oldPlayers,
                         you:{
                              id:playerId,
                              username,
                              state:'idle'
                         }
                    })
                    this.socket.broadcast.emit('playerList',{
                         players
                    })
                    cb(player,this.players)
               }
          })
     }
     protected findSocket(roomId:string){
          let targetSocket 
          const allSockets = this.io.of('/').sockets
          for(const[_key,socket] of allSockets){
               const room = socket.rooms
               if(room.has(roomId)){
                    targetSocket = socket
                    break
               }
          }
          return targetSocket
     }
     protected playerList(){
          this.socket.broadcast.emit('playerList',{
               players:this.players.getPlayers()
          })
     }
}

export default Events