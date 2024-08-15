import { 
     List, 
     Grid, 
     Box 
} from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { EventContext, PlayerEmitterContext } from "."
import PlayerCard from "./player-card"

function PlayerLists({
     players,
     you,
     setDialogBoxState,
     matchInfo,
     setMatchInfo,
     setIsGameStarted,
     isGameStarted,
     isResetMatchState,
     setIsResetMatchState,
     playAgain,
     setPlayAgain,
     setNewOpponent,
     newOpponent
}:IPlayerList){

     const event = useContext(EventContext)
     const playerEmitter = useContext(PlayerEmitterContext)
     const [matchState,setMatchState] = useState<TMatchState>('idle')
     const [matchRequest,setMatchRequest] = useState<Map<string,boolean>>(new Map())
     const [playerState,setPlayerState] = useState<Map<string,string>>(new Map())
     const [opponentId,setOpponentId] = useState('')
     function handleMatch(){
          setMatchState('matching')
     }
     useEffect(()=>{
          console.log(players,'these are players')
          const map1 = new Map()
          const map2 = new Map()
          players.forEach((prev)=>{
               map1.set(prev.id,false)
               map2.set(prev.id,prev.state)
          })
          setMatchRequest(map1)
          setPlayerState(map2)
          // setMatchRequest((prev)=>{
          //      players.forEach(({id})=>{
          //           prev?.set(id,false)
          //      })
          //      return prev
          // })
          
          // setPlayerState((prev)=>{
          //      players.forEach(({id,state})=>{
          //           prev?.set(id,state)
          //      })
          //      return prev
          // })
     },[players])
     useEffect(()=>{
          console.log(playerState,'these are the playerState')
          console.log(matchRequest,'these are the match request')
     },[playerState,matchRequest])
     useEffect(()=>{
          if(playAgain && opponentId){
               handleMatchRequest(opponentId)
               setPlayAgain(false)
          }
     },[playAgain,opponentId])

     useEffect(()=>{
          if(newOpponent && !isGameStarted){
               handleMatchRequest(newOpponent)
               setNewOpponent('')
          }
     },[newOpponent,isGameStarted,setNewOpponent])
     function handleMatchRequest(playerId:string){
          if(isGameStarted){
               setDialogBoxState(true)
               setNewOpponent(playerId)
          }
          if(!isGameStarted){
               const playerMatchRequest = matchRequest?.get(playerId)
               if(playerMatchRequest){
                    playerEmitter?.cancelMatchRequest(playerId)            
               }else {
                    playerEmitter?.friendlyMatchRequest(playerId)
               }
               const newMap = new Map(matchRequest)
               newMap.set(playerId,!playerMatchRequest)
               setMatchRequest(newMap)
          }
     }
     function preventMatchRequestDuringActiveGame(){
          // but before confirming this you 
          // handleMatchRequest(requestebyd)
     }
     function handleRandomMatchRequest(){
          playerEmitter?.randomMatchRequest()

     }
     function confirmMatchLeave(){
          // emit match leave event
          playerEmitter?.leftMatch()
          setDialogBoxState(true)
     }
     function resetMatchState(){
          // here we have access to the opponent id
          const newPlayerState = new Map(playerState)
          const {player1,player2}=matchInfo.players
          if(player1 && player2 && you){
               const opId = [player1.id,player2.id].find((id)=>id!==you.id) 
               if(opId)
               setOpponentId(opId)
               newPlayerState.set(player1?.id,'idle')
               newPlayerState.set(player2?.id,'idle')
               setPlayerState(newPlayerState)
               setIsGameStarted(false)
               setMatchInfo({
                    status:'idle',
                    players:{
                         player1:null,
                         player2:null
                    }
               })
          }
     }
     useEffect(()=>{
          if(isResetMatchState){
               resetMatchState()
               setIsResetMatchState(false)
          }
     },[isResetMatchState])
     useEffect(()=>{
          event?.startMatch((data)=>{
               const {player1,player2}=data
               const {id:id1}=player1
               const {id:id2}=player2
               setMatchInfo({
                    status:'playing',
                    players:{
                         player1,
                         player2
                    }
               })
               const newMap = new Map(playerState)
               const newMap1 = new Map(matchRequest)
               newMap.set(id1,'playing')
               newMap.set(id2,'playing')
               newMap1.set(id1,false)
               newMap1.set(id2,false)
               setPlayerState(newMap)
               setMatchRequest(newMap1)
               setIsGameStarted(true)

          })
          event?.acceptMatchRequest((data)=>{
               const newMatchRequest = new Map(matchRequest)
               newMatchRequest.set(data.id,false)
               setMatchRequest(newMatchRequest)
          })
          event?.rejectMatchRequest((data)=>{
               const newMatchRequest = new Map(matchRequest)
               newMatchRequest.set(data.id,false)
               setMatchRequest(newMatchRequest)
          })
          event?.leftMatch((data)=>{
               console.log(data)
               setIsResetMatchState(true)
          })
          return()=>{
               event?.removeRejectMatchRequest()
               event?.removeAcceptMatchRequest()
               event?.removeStartMatch()
               event?.removeLeftMatch()
          }
     })
     return(
          <Grid item>
               <List>
                    {
                         players.map(({id,username},i)=>(
                              <PlayerCard
                              key={i}
                              id={id}
                              username={username}
                              state={playerState?.get(id)||'idle'}
                              isRequestedForMatch={matchRequest?.get(id)}
                              handleMatchRequest={handleMatchRequest}
                              />
                         ))
                    }
                    
                    {
                         you && 
                    <PlayerCard
                    id={you.id}
                    username={you.username}
                    state={isGameStarted?'playing':'idle'}
                    isYou={true}
                    confirmMatchLeave={confirmMatchLeave}
                    />
                    }

                    <Box
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    sx={{boxShadow:'none'}}
                    >
                         <button
                         className="primary-btn"
                         onClick={handleRandomMatchRequest}
                         >
                              {
                                   matchState === 'idle' ? 'match' : 
                                   matchState === 'matching' ? 'matching...' : 'playing'
                              }
                         </button>
                    </Box>
               </List>
          </Grid>
     )
}

export default PlayerLists