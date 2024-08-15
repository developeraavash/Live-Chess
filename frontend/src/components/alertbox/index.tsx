import { Paper, Alert, Snackbar} from "@mui/material"
import { useEffect, useState, useContext } from "react"
import { EventContext } from "../playground"
function AlertBox(){

     const event = useContext(EventContext)
     const [alertBoxState,setAlertBoxState] = useState(false)
     const [alertMessage,setAlertMessage] = useState('')
     const [boxType,setBoxType] = useState<'error'|'info'>('info')
     event?.error((data)=>{
          const {message} = data
          setBoxType('error')
          setAlertMessage(message)
     })
     event?.info((data)=>{
          const {message} = data
          setBoxType('info')
          setAlertMessage(message)
     })
     useEffect(()=>{
          if(alertMessage){
               setAlertBoxState(true)
          }
     },[alertMessage])
     function handleAlertBoxClose(){
          setAlertBoxState(false)
          setAlertMessage('')
     }
     return(
          <Paper
          sx={{
               boxShadow:'none'
          }}
          >
               {
                    alertMessage && <Snackbar open={alertBoxState} 
                    autoHideDuration={6000} >
                         <Alert severity={boxType}
                         onClose={handleAlertBoxClose}
                         sx={{ width: '100%' }}>
                              {alertMessage}
                         </Alert>
                  </Snackbar>
               }
          </Paper> 
     )
}

export default AlertBox