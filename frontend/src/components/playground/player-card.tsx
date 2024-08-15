import { ListItem, Paper } from "@mui/material";
import { useEffect } from "react";

function PlayerCard(props:IPlayerCard){
     const {
          id,
          username,
          state,
          isYou=false,
          isRequestedForMatch=false,
          handleMatchRequest,
          confirmMatchLeave
     } = props
     const playBtnAttributes = !isYou?{
          onClick:handleMatchRequest?.bind(null,id)
     }:{}
     return(
          <ListItem>
               <Paper
               sx={{
                    padding:1,
                    boxShadow:'none'
               }}
               >
                    <span>
                         {username}
                    </span>
                    {
                         isYou?
                         (
                              state==='idle'?
                              ("(you)"):
                              (
                                   <button
                                   onClick={confirmMatchLeave}
                                   >
                                        Leave
                                   </button>
                              )
                         ):(
                              <>
                              {
                                   isRequestedForMatch && state==='idle' && (
                                        <button
                                        {...playBtnAttributes}
                                        >
                                             Cancel
                                        </button>
                                   )
                              }
                              {
                                   state==='idle' && !isRequestedForMatch && (
                                        <button
                                        {...playBtnAttributes}
                                        >
                                             Play
                                        </button>
                                   )
                              }
                              {
                                   state==='playing' && !isRequestedForMatch && <span>Playing</span>
                              }
                              </>
                         )
                    }

               </Paper>
          </ListItem>
     )
}


export default PlayerCard