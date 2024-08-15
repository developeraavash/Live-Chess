import { Grid, Paper, Container, Box, Typography } from "@mui/material"
import ChessCell from "./chess-cell"
import Pawn from "./players/pawn"
import React, { useContext, useEffect, useRef, useState } from "react"
import { EventContext, PlayerEmitterContext } from "../playground"
import Bishop from "./players/bishop"
import createBoard from "./create-board"
import Knight from "./players/knight"
import Rook from "./players/rook"
import Queen from "./players/queen"
import King from "./players/king"

function Board({
     you,
     isGameStarted,
     setIsGameStarted
}:{
     you:IPlayer|null,
     isGameStarted:boolean,
     setIsGameStarted:React.Dispatch<React.SetStateAction<boolean>>
}){
     const playerEmitter = useContext(PlayerEmitterContext)
     const event = useContext(EventContext)
     const pieceTapped = useRef<IChessCell|null>(null)
     const [lastPiece,setLastPiece] = useState<any>(null)
     function test(cell:IChessCell){
          if(isGameStarted && canMove){
               const {
                    position,
                    type,
                    player
               } = cell
               const {x,y}=position
               if(pieceTapped.current && type!=='host'){
                    if(lastPiece && !lastPiece.checkIfMoveIsValid([x,y]))
                    return
                    const tappedPlayer = pieceTapped.current
                    pieces[x][y] = {
                         ...cell,
                         player:tappedPlayer.player,
                         playerPath:tappedPlayer.playerPath,
                         type:tappedPlayer.type
                    }
                    const {x:posX,y:posY}=tappedPlayer.position
                    pieces[posX][posY] = {
                         ...tappedPlayer,
                         type:null,
                         player:null,
                         playerPath:''
                    }
                    setCanMove(false)
                    playerEmitter?.movePiece({
                         lastPos:[posX,posY],
                         newPos:[x,y],
                         isPieceMurdered:player?true:false,
                         isKingMurdered:player==='king'?true:false,
                         playerType:playersInfo.you.type
                    })  
                    lastPiece.unhighLightPossibleMoves()
                    pieceTapped.current = null
                    setPieces([...pieces])
                    setLastPiece(null)
                    setMovementTurn('')
               }else {
                    if(lastPiece){
                         lastPiece.unhighLightPossibleMoves()
                         setLastPiece(null)
                    }
                    if(type==='host'){
                         if(player){
                              const piece = ({
                                   pawn:new Pawn(pieces),
                                   rook:new Rook(pieces),
                                   knight:new Knight(pieces),
                                   bishop:new Bishop(pieces),
                                   queen:new Queen(pieces),
                                   king:new King(pieces)
                              })[player]
                              if(piece){
                                   piece.getPossibleMoves([x,y])
                                   const newPiece = piece.highlightPossibleMoves()
                                   setLastPiece(piece)
                                   setPieces([...newPiece])
                              }
                         }
                         pieceTapped.current = cell
                    }
               }
          }

     }
     const [pieces,setPieces] = useState<IChessCell[][]>([])
     const playersDefaultInfo = {
          you:{
               username:'',
               type:null
          },
          opponent:{
               username:'',
               type:null
          }
     }
     const [playersInfo,setPlayersInfo] = useState<IPlayers>(playersDefaultInfo)
     useEffect(()=>{
          if(!isGameStarted){
               setPieces([...createBoard()])
               setPlayersInfo(playersDefaultInfo)
          }
     },[isGameStarted])
     const [movementTurn,setMovementTurn]=useState('')
     const [canMove,setCanMove]=useState(false)
     useEffect(()=>{
          
          event?.matchInfo((data)=>{
               setPlayersInfo(data)
          })
          event?.movePiece((data)=>{
               if(!isGameStarted){
                    setIsGameStarted(true)
               }
                    setCanMove(true)
                    setMovementTurn(data.movementTurn)
                    if('lastPos' in data && 
                    'newPos' in data && 
                    'movementTurn' in data){
                         const {lastPos,newPos}=data
                         const [lX,lY] = lastPos
                         const[nX,nY]=newPos
                         pieces[nX][nY]={
                              ...pieces[nX][nY],
                              type:'remote',
                              player:pieces[lX][lY].player,
                              playerPath:pieces[lX][lY].playerPath
                         }
                         pieces[lX][lY]={
                              ...pieces[lX][lY],
                              type:null,
                              player:null,
                              playerPath:''
                         }
                         setPieces([...pieces])
                    }
          })
          return()=>{
               event?.removeMovePiece()
               event?.removeMatchInfo()
          }
     },[event,pieces,isGameStarted,setIsGameStarted])
     return(
          <Container>
               {
                    isGameStarted && <Box>
                    <Typography
                    sx={{
                         fontFamily:'cursive'
                    }}
                    >
                         [{playersInfo.opponent.username}]
                         {
                              !movementTurn?`${playersInfo.opponent.username} turn`:''
                         }
                    </Typography>
               </Box>
               }
               
               <Grid 
               item
               sx={{
               }}
               >
                    <Paper
                    sx={{boxShadow:'none'}}
                    >
                         <Grid 
                         sx={{
                              border:'1px solid #000'
                         }}
                         container direction='column'>
                              {
                                   pieces.map((row,rowIndex)=>(
                                        <Grid container item key={rowIndex}>
                                             {
                                                  row.map((cell:any,cellIndex:any)=>(
                                                      <ChessCell
                                                      onClick={()=>test(cell)}
                                                      cellProps={cell}
                                                      key={`${rowIndex}-${cellIndex}`} />
                                                  ))
                                             }
                                        </Grid>
                                   ))
                              }
                         </Grid>
                    </Paper>
               </Grid>
               {
                    isGameStarted && <Box>
                    <Typography
                    sx={{
                         fontFamily:'cursive',
                         textAlign:'end'
                    }}
                    >
                         {
                              playersInfo.you.type === movementTurn?'your turn':''
                         }
                         <span>
                              [{you?.username}(you)]
                         </span>
                    </Typography>
               </Box>
               }
               
          </Container>
          
     )
}

export default Board