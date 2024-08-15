
class Cell{
     cells:string[]
     constructor(){
          this.cells = []
     }
     public addCell(pos:string){
          this.cells.push(pos)
     }
     public removeAllCell(){
          this.cells = []
     }
}
export default Cell