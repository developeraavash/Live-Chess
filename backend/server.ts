import app from './app'
import http from 'http'
import {Server} from 'socket.io'
import SocketManager from './socket'
import Matches from './model/matches'
import Player from './model/player'
import RandomMatch from './model/random-match'

const PORT = process.env.PORT || 5000
const httpServer = http.createServer(app)
const origins = ['http://localhost:3000']
const io = new Server(httpServer,{
     cors:{
          origin:(origin,cb)=>{
               if(origin)
                    if(origins.includes(origin))
                    return cb(null,origin)
               return cb(new Error('not allowed by cors'))
     }
}
})
const socketManager = new SocketManager(io)
const matches = new Matches()
const randomMatch = new RandomMatch()
io.on('connection',(socket)=>{
     socketManager.connect(socket,matches,randomMatch)
})
httpServer.listen(PORT,()=>{
     console.log('server is running on port',PORT)
})

process.on('unhandledRejection',()=>{
     process.exit(1)
})

process.on('uncaughtException',()=>{
     process.exit(1)
})