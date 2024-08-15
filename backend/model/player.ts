

class Player{
     private id:string
     public username:string
     state:'idle'|'playing'
     constructor(id:string,username:string){
          this.id= id
          this.username = username
          this.state = 'idle'
     }
     public get playerId():string{
          return this.id
     }
     
}

export default Player