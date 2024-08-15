
class Player{
     id:string
     username:string
     state:TPlayerState
     constructor(id:string,username:string){
          this.id= id
          this.username = username
          this.state = 'idle'
     }


}

export default Player