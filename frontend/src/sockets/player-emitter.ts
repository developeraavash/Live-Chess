import { Socket } from 'socket.io-client';
import Player from "../components/playground/player"
import Emitter from "./emitter"

class PlayerEmitter extends Emitter{
     player:Player
     constructor(player:Player,socket:Socket){
          super(socket)
          this.player = player
     }
     public friendlyMatchRequest(opponentId:string){
          this.socket.emit('friendlyMatchRequest',{opponentId})
     }
     public randomMatchRequest(){
          this.socket.emit('randomMatchRequest')
     }
     public acceptMatchRequest(requestedBy:string){
           this.socket.emit('acceptMatchRequest',{requestedBy})
     }
     public rejectMatchRequest(requestedBy:string){
          this.socket.emit('rejectMatchRequest',{requestedBy})
     }
     public cancelMatchRequest(opponentId:string){
          this.socket.emit('cancelMatchRequest',{opponentId})
     }
     public noMatchRequestResponse(opponentId:string){
          this.socket.emit('noMatchRequestResponse',{opponentId})
     }
     public movePiece(data:any){
          this.socket.emit('movePiece',data)
     }
     leftMatch(){
          this.socket.emit('leftMatch')
     }
}


export default PlayerEmitter