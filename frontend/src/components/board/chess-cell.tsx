import { Avatar, Paper, Grid } from "@mui/material"

function ChessCell({
     cellProps,
     onClick,
}:TChessCell){

     return(
          <Paper
          id='piece'
          data-pos={`${cellProps.position.x}-${cellProps.position.y}`}
          onClick={onClick}
          sx={{
               bgcolor:cellProps.bgColor,
               height:80,
               width:80,
               borderRadius:0,
               cursor:'pointer',
               opacity:cellProps.isHighLighted?0.5:1
          }}
          >
               <Grid
               container
               justifyContent='center'
               alignItems='center'
               sx={{
                    height:'100%'
               }}
               >
                    {
                         cellProps.player && <Avatar
                         src={`${cellProps.playerPath}`}
                         alt=''
                         />
                    }
               
                    
               </Grid>
          </Paper>
     )
}

export default ChessCell