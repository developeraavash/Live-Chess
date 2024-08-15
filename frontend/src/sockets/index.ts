import io from 'socket.io-client'


const socketUrl = 'http://localhost:5000'
const socket = io(socketUrl)

socket.on('connect',()=>{
     console.log('Connected')
})

socket.on('disconnect',()=>{
     console.log('Disconncted')
})
socket.on('connect_error',()=>{
     console.log('Error while connecting')
     socket.connect(); // try to reconnect
})
export default socket