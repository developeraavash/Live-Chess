

function createBoard():IChessCell[][]{
     const board = new Array(8).fill(new Array(8).fill((null)))
     const players = ['rook.svg','knight.svg','bishop.svg','king.svg','queen.svg','bishop.svg','knight.svg','rook.svg']
     const hostPath = '/pieces/host/'
     const remotePath = '/pieces/remote/'
     for (let i = 0; i < 8; i++) {
          board[i] = [];
          for (let j = 0; j < 8; j++) {
               let cellProps : IChessCell = {
                    bgColor:'',
                    position:{
                         x:i,
                         y:j
                    },
                    player:null,
                    playerPath:'',
                    type:null,
                    isHighLighted:false
               }
               if(i===0 || i===1){
                    if(i===0){
                         cellProps.playerPath = remotePath+players[j]
                         cellProps.player = players[j].split('.')[0] as TPiece
                         
                    }else { 
                         cellProps.playerPath = remotePath+'pawn.svg'
                         cellProps.player = 'pawn'
                    }
                    cellProps.type = 'remote'
               } else if(i===6||i===7){
                    if(i===6){
                         cellProps.playerPath = hostPath+'pawn.svg'
                         cellProps.player = 'pawn'
                    }else{
                         cellProps.playerPath = hostPath+players[j]
                         cellProps.player = players[j].split('.')[0] as TPiece
                    }
                    cellProps.type = 'host'
               }
               if((i+j)%2===0){
                    cellProps.bgColor = '#e7facf'
               }else {
                    cellProps.bgColor = '#65aa5c'
               }
               board[i][j] = {...cellProps}
          }
     }
     return board
}

export default createBoard