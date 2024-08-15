import { Box, Typography } from "@mui/material"
import { useEffect, useRef, useState } from "react"


function MatchTimer({
     isGameStarted
}:{isGameStarted:boolean}){

     const [timer,setTimer] = useState(1)
     const timerRef = useRef<any>(null)
     useEffect(()=>{
          if(isGameStarted){
               timerRef.current = setInterval(()=>{
               setTimer((prev)=>prev+1)  
               },1000)
          }
          return()=>{
               clearInterval(timerRef.current)
          }
     },[timer,isGameStarted])
     useEffect(()=>{
          if(!isGameStarted){
               clearInterval(timerRef.current)
               setTimer(1)
          }
     },[isGameStarted])

     return(
          <Box>
               <Typography
               sx={{
                    fontFamily:'cursive',
                    textAlign:'center'
               }}
               >
                    <span>Match time:</span>
                    {
                         timer
                    }
               </Typography>
          </Box>
     )
}

export default MatchTimer