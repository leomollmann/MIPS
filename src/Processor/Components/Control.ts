type Signals = {
  PCConditionalWrite: number
  PCWrite: number
  PCOrALU: number
  ReadMemory: number
  WriteMemory: number
  MemoryToRegister: number
  IRWrite: number
  WriteRegister: number
  RegisterBankWrite: number
  ALUSourceA: number
  ALUSourceB: number
  ALUOP: number
  PCSource: number
}

const opcodes = {
  LW: 35,
  SW: 43
}

class ControlUnit {
  public step: (opcode: number) => Signals = this.fetchStep

  private fetchStep(opcode: number) {
    this.step = this.decodeStep
    return this.complete({
      PCWrite: 1,
      ReadMemory: 1,
      IRWrite: 1,
      ALUSourceB: 1
    })
  }

  private decodeStep(opcode: number) {
    switch(opcode){
      case opcodes.SW:
      case opcodes.LW: {
        this.step = this.addressCalculationStep
        break
      }
      default: this.step = this.fetchStep
    }
    return this.complete({
      ALUSourceB: 3
    })
  }

  private addressCalculationStep(opcode: number) {
    switch(opcode){
      case opcodes.SW: {
        this.step = this.storeMemoryStep
        break
      }
      case opcodes.LW: {
        this.step = this.loadMemoryStep
        break
      }
      default: this.step = this.fetchStep
    }
    return this.complete({
      ALUSourceA: 1,
      ALUSourceB: 2
    })
  }

  private loadMemoryStep(opcode: number) {
    switch(opcode){
      case opcodes.LW: {
        this.step = this.writeTargetStep
        break
      } 
      default: this.step = this.fetchStep
    }
    return this.complete({
      PCOrALU: 1,
      ReadMemory: 1
    })
  }

  private writeTargetStep(opcode: number) {
    this.step = this.fetchStep
    return this.complete({
      RegisterBankWrite: 1,
      MemoryToRegister: 1
    })
  }

  private storeMemoryStep(opcode: number) {
    this.step = this.fetchStep
    return this.complete({
      PCOrALU: 1,
      WriteMemory: 1
    })
  }

  private complete(some: Partial<Signals>): Signals {
    return {
      PCConditionalWrite: some.PCConditionalWrite || 0,
      PCWrite: some.PCWrite || 0,
      PCOrALU: some.PCOrALU || 0,
      ReadMemory: some.ReadMemory || 0,
      WriteMemory: some.WriteMemory || 0,
      MemoryToRegister: some.MemoryToRegister || 0,
      IRWrite: some.IRWrite || 0,
      WriteRegister: some.WriteRegister || 0,
      RegisterBankWrite: some.RegisterBankWrite || 0,
      ALUSourceA: some.ALUSourceA || 0,
      ALUSourceB: some.ALUSourceB || 0,
      ALUOP: some.ALUOP || 0,
      PCSource: some.PCSource || 0
    }
  }
}

export default ControlUnit