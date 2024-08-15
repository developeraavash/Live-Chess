import { Socket } from 'socket.io-client';
import Match from "../components/playground/match";
import Player from '../components/playground/player';
import Emitter from "./emitter";

class MatchEmitter extends Emitter{
     match:Match
     constructor(match:Match,socket:Socket){
          super(socket)
          this.match = match

     }
     public matchRequest(){
     }
     public randomMatchRequest(){

     }
}

export default MatchEmitter