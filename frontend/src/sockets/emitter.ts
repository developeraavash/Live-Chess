import { Socket } from 'socket.io-client';
import Player from "../components/playground/player"

class Emitter{
     socket:Socket
     constructor(socket:Socket){
          this.socket = socket
     }
     public createPlayer(username:string){
          this.socket.emit('createPlayer',{
               username
          })
     }

}

export default Emitter