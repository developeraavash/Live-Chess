import { Container, Grid, Box } from "@mui/material"
import { createContext, useEffect, useReducer, useState } from "react"
import Board from "../board"
import Match from "./match"
import Player from "./player"
import PlayerLists from "./players-list"
import Emitter from "../../sockets/emitter"
import Events from "../../sockets/events"
import PlayerEmitter from "../../sockets/player-emitter"
import socket from "../../sockets"
import { Socket } from "socket.io-client"
import AlertBox from "../alertbox"
import DialogBox from "../dialog-box"
import MatchTimer from "../match-timer"
const event = new Events(socket)
const emitter = new Emitter(socket)
export const PlayerEmitterContext = createContext<PlayerEmitter|null>(null)
export const SocketContext = createContext<Socket>(socket)
export const EventContext = createContext<Events|null>(null)
export const MatchInfoContext = createContext<IMatchInfo|null>(null)

function Playground(){
     const [state,dispatch] = useReducer((state:IPlaygroundState,action:{
          type:string,
          payload:any
     })=>{
          const {type,payload} = action
          if(type==='PLAYERS'){
               return {
                    ...state,
                    players:payload
               }
          }
          else if(type === 'YOU'){
               return {
                    ...state,
                    you:payload
               }
          }
          else if(type==='PLAYERS_AND_YOU'){
               return {
                    you:payload.you,
                    players:payload.players
               }
          }
          else return state
     },{
          players:[],
          you:null,
     })
     const [player,setPlayer] = useState<Player|null>(null)
     const [playerEmitter,setPlayerEmitter] = useState<PlayerEmitter|null>(null)
     const [username,setUsername] = useState('')
     const [isGameStarted,setIsGameStarted] = useState(false)
     const [isResetMatchState,setIsResetMatchState]=useState(false)
     const [playAgain,setPlayAgain]=useState(false)
     const [newOpponent,setNewOpponent]=useState('')
     const [matchInfo,setMatchInfo] = useState<IMatchInfo>({
          status:'idle',
          players:{
               player1:null,
               player2:null
          }
     })
     useEffect(()=>{
          event.playerList((data:{
               players:IPlayer[]
          })=>{
               const otherPlayers = data.players.filter(
                    (player)=>player.id!==state.you.id)
                    console.log(otherPlayers,'hehe')
                    dispatch({
                         type:'PLAYERS',
                         payload:otherPlayers
                    })
               })
          return()=>{
               event.removePlayerList()
               event.removeUpdatePlayerList()
          }
     })
     socket.on('playerCreated',(playerInfo)=>{
          const {
               you,
               players
          } = playerInfo
          const {id,username}=you
          setPlayer(new Player(id,username))
          dispatch({
               type:'PLAYERS_AND_YOU',
               payload:playerInfo,

          })
     })

     function askForUsername(){
          const promptValue = prompt('Enter username...')
          if(!promptValue){
               askForUsername()
          }
          else {
               setUsername(promptValue)
          }
     }
     useEffect(()=>{
          if(player){
               setPlayerEmitter(new PlayerEmitter(player,socket))
          }
     },[player])
     useEffect(()=>{
          if(username)
          emitter.createPlayer(username)
     },[username])
     useEffect(()=>{
          if(!username)
          askForUsername()
     },[])
     const [dialogBoxState,setDialogBoxState]=useState(false)
     return (
          <SocketContext.Provider value={socket}>
               <EventContext.Provider
               value={event}
               >

                    <Container
                    style={{
                         height:'100vh',
                         justifyContent:'center',
                         alignItems:'center',
                         display:'flex'

                    }}
                    maxWidth='lg'
                    >
                         <PlayerEmitterContext.Provider
                         value={playerEmitter}
                         > 
                              <MatchInfoContext.Provider
                              value={matchInfo}
                              >
                                   <AlertBox/>
                                   <DialogBox
                                   playAgain={playAgain}
                                   setPlayAgain={setPlayAgain}
                                   setDialogBoxState={setDialogBoxState}
                                   dialogBoxState={dialogBoxState}
                                   setIsGameStarted={setIsGameStarted}
                                   setIsResetMatchState={setIsResetMatchState}
                                   
                                   />
                                   <Grid
                                   container
                                   spacing={2}
                                   justifyContent='center'
                                   >
                                                            
                                             <PlayerLists
                                             newOpponent={newOpponent}
                                             setNewOpponent={setNewOpponent}
                                             playAgain={playAgain}
                                             setPlayAgain={setPlayAgain}
                                             matchInfo={matchInfo}
                                             setMatchInfo={setMatchInfo}
                                             setDialogBoxState={setDialogBoxState}
                                             you={state.you}
                                             players={state.players} 
                                             isGameStarted={isGameStarted}
                                             setIsGameStarted={setIsGameStarted}
                                             isResetMatchState={isResetMatchState}
                                             setIsResetMatchState={setIsResetMatchState}
                                             />
                                             <Box 
                                             >
                                                  {
                                                       isGameStarted && <MatchTimer
                                                       isGameStarted={isGameStarted}
                                                       />
                                                  }
                                                  <Board
                                                  isGameStarted={isGameStarted}
                                                  setIsGameStarted={setIsGameStarted}
                                                  you={state.you}
                                                  />
                                             </Box>
                                   </Grid>
                              </MatchInfoContext.Provider>
                         </PlayerEmitterContext.Provider>
                    </Container>
               </EventContext.Provider>
          </SocketContext.Provider>

     )
}

export default Playground