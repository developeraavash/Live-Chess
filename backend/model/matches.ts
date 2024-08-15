import Match from "./match"


class Matches{
     matches:Match[]
     constructor(){
          this.matches = []
     }
     addMatch(match:Match){
          this.matches.push(match)
     }
     findMatch(matchId:string):Match|undefined{
          return this.matches.find((match)=>match.getMatchId===matchId)
     }
     // removeMatch(match:Match){
     //      this.matches = this.matches.filter(({matchId})=>matchId!==match.matchId)
     // }
}

export default Matches