

interface Props<T>{
     id:string
     confirmMatchLeave:T
     handleMatchRequest:T
}

function Item<T>(props:Props<T>){
     
     const {
          id,
          confirmMatchLeave,
          handleMatchRequest
     } = props
     const attribute =  
     {
          onclick:confirmMatchLeave
     }
     return(
          <div>
               <button
               {...attribute}
               >

               </button>
          </div>
     )
}
function Test(){
     return(
          <div>
               <Item
               id='123'
               confirmMatchLeave={null}
               handleMatchRequest={null}
               />
               <Item
               id="12"
               confirmMatchLeave={function(){
                    console.log('confirm match leave')
               }}
               handleMatchRequest={()=>{
                    console.log('hanele match request')
               }}
               />
          </div>
     )
}

export default Test