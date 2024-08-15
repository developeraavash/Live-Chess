import { Dialog, DialogActions, DialogContent, DialogTitle, Paper, Typography,  } from "@mui/material"
import { useContext, useEffect, useReducer, useRef, useState } from "react"
import { EventContext, MatchInfoContext, PlayerEmitterContext } from "../playground"


function DialogBox({
     setDialogBoxState,
     dialogBoxState,
     setIsGameStarted,
     setIsResetMatchState,
     setPlayAgain,
     playAgain
}:{
     setDialogBoxState:React.Dispatch<React.SetStateAction<boolean>>,
     dialogBoxState:boolean,
     setIsGameStarted:React.Dispatch<React.SetStateAction<boolean>>
     setIsResetMatchState:React.Dispatch<React.SetStateAction<boolean>>
     setPlayAgain:React.Dispatch<React.SetStateAction<boolean>>
     playAgain:boolean
}){
     const event = useContext(EventContext)
     const matchInfo = useContext(MatchInfoContext)
     const playerEmitter = useContext(PlayerEmitterContext)
     const timerRef : any = useRef(null)
     
     const defaultValue = {
          title:'',
          message:'',
          timer:1,
          action:[],
          funcs:[]
     }
     const defaultAction= {
          type:'',
          payload:''
     }
     const reducer = (state:IDialogBox,action:IDialogBoxAction)=>{
          const {type,payload} = action
          if(type === 'MATCH_END'){
               return {
                    title:'Match over',
                    message:payload,
                    action:['play again','ok'],
                    funcs:[handlePlayMatchAgain,handleMatchEnd]
               }
          }
          else if(type === 'MATCH_REQUEST'){
               return {
                    timer:1,
                    title:'Match request',
                    message:payload,
                    action:['accept','reject'],
                    funcs:[acceptMatchRequest,rejectMatchRequest]
               }
          }
          else if(type === 'MATCH_REQUEST_TIMER'){
               const timer = state.timer || 0
               return {
                    ...state,
                    timer:timer+1
               }
          }
          else if(type === 'MATCH_LEFT_BY_OPPONENT'){
               return {
                    ...state,
                    title:'Match leave',
                    message:payload,
                    action:['ok'],
                    funcs:[handleMatchEnd]
               }
          }
          else if(type==='MATCH_LEFT_BY_YOU'){
               return {
                    ...state,
                    title:'Confirm match leave',
                    message:payload,
                    action:['yes','no'],
                    funcs:[handleLeaveMatch,handleMatchEnd]
               }
          }
          else return defaultValue
     }
     const [state,dispatch]=useReducer(reducer,defaultValue)
     const [requestedBy,setRequestedBy] = useState('')
     function handleLeaveMatch(){
          dispatch(defaultAction)
          playerEmitter?.leftMatch()
     }
     function handleMatchEnd(){
          dispatch(defaultAction)
     }
     function acceptMatchRequest(){
          handleMatchEnd()
          playerEmitter?.acceptMatchRequest(requestedBy)
     }
     function rejectMatchRequest(){
          handleMatchEnd()
          playerEmitter?.rejectMatchRequest(requestedBy)
     }
     function resetStates(){
          setRequestedBy('')
          dispatch(defaultAction)
     }
     function handlePlayMatchAgain(){
          setPlayAgain(true)
     }
     useEffect(()=>{
          if(playAgain){
               dispatch(defaultAction)
          }
     },[playAgain])
     useEffect(()=>{
          event?.cancelMatchRequest(()=>{
               resetStates()
          })
          event?.askForAcceptOrRejectMatchRequest((data)=>{
               const {message, requestedBy} = data
               setRequestedBy(requestedBy)
               dispatch({
                    type:'MATCH_REQUEST',
                    payload:message
               })
          })
          event?.matchEnd((data)=>{
               const {message} = data
               dispatch({
                    type:'MATCH_END',
                    payload:message
               })
               setIsGameStarted(false)
               setIsResetMatchState(true)
          })
          return()=>{
               event?.removeALlListener()
               event?.removeCancelRequest()
               event?.removeMatchEnd()
          }
     })
     useEffect(()=>{
          if(state.message && state.timer && state.timer < 10){
               timerRef.current = setInterval(()=>{
                    dispatch({
                         type:'MATCH_REQUEST_TIMER',
                         payload:''
                    })
               },1000)
          }
          else if(state.timer && state.timer === 10){
               setTimeout(()=>{
                    clearInterval(timerRef.current)
                    dispatch(defaultAction)
                    playerEmitter?.noMatchRequestResponse(requestedBy)
               },1000)
          }
          return()=>{
               clearInterval(timerRef.current)
          }
     },[state,requestedBy,playerEmitter])
     useEffect(()=>{
          if(dialogBoxState){
               dispatch({
                    type:'MATCH_LEFT_BY_YOU',
                    payload:'Are you sure to exit match?'
               })
               setDialogBoxState(false)
          }
     },[dialogBoxState,setDialogBoxState])
     return(
          <Paper>
               <Dialog
               open={state.message?true:false}
               >
                    <DialogTitle 
                    sx={{
                         fontFamily:'cursive'
                    }}
                    >
                         {
                              state.title
                         }
                         {
                              state.title === 'Match request' ? `${state.timer}` : ''
                         }
                    </DialogTitle>
                    <DialogContent dividers>
                         <Typography
                         sx={{
                              fontFamily:'cursive'
                         }}
                         >
                              {state.message}
                         </Typography>
                    </DialogContent>
                    <DialogActions>
                         {
                              state.funcs.map((func,i)=>(
                                   <button
                                   key={i}
                                   onClick={func}
                                   className={`${i===0?'primary-btn':''}`}
                                   >
                                        {state.action[i]}
                                   </button>
                              ))
                         }
                         
                    </DialogActions>
               </Dialog>
          </Paper>
     )
}

export default DialogBox