import Data from "../Entities/Data";

class Memory {
  private memory: Record<number, number> = {}
  private readEnable: boolean = false
  private writeEnable: boolean = false

  constructor(data: Data[]) {
    data.forEach(({address, value}) => this.memory[address] = value)
  }

  read(address: number) {
    if(!this.readEnable) return 0
    return this.memory[address] || 0
  }

  write(address: number, value: number) {
    if(this.writeEnable) 
      this.memory[address] = value
  }

  setReadEnable(enable: boolean) { this.readEnable = enable } 
  setWriteEnable(enable: boolean) { this.writeEnable = enable }
}

export default Memory
