import shortid from "shortid";

const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@'
const generatePlayerId = ():string=>{
     shortid.characters(characters)
     const playerId = shortid.generate()
     return playerId
}
export default generatePlayerId