import shortid from "shortid"

class Utils{
     private characters:string
     constructor(){
          this.characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@'
     }
     public generateId():string{
          shortid.characters(this.characters)
          const playerId = shortid.generate()
          return playerId
     }
}

const u = new Utils()
export default u