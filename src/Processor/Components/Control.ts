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
  shiftSource: number
}

export const ALUOPs = {
  ADDU: 0,
  SUB: 1,
  FUNCT: 2,
  LUI: 3,
  ORI: 4,
  AND: 5,
  DIFF: 6
}

const opcodes = {
  LW: 35,
  SW: 43,
  R: 0,
  LUI: 15,
  ORI: 13,
  ADDIU: 9,
  ANDI: 12,
  BNE: 5,
  BEQ: 4
}

class ControlUnit {
  public step: (opcode: number) => Signals = this.fetchStep

  // Etapa de busca
  private fetchStep(opcode: number) {
    this.step = this.decodeStep
    return this.complete({
      PCWrite: 1,
      ReadMemory: 1,
      IRWrite: 1,
      ALUSourceB: 1
    })
  }

  // Etapa de decodificação
  private decodeStep(opcode: number) {
    switch(opcode){
      case opcodes.R: {
        this.step = this.typeRExecution
        break
      }
      case opcodes.SW:
      case opcodes.LW: {
        this.step = this.addressCalculationStep
        break
      }
      case opcodes.LUI: {
        this.step = this.loadUpperImmediate
        break
      }
      case opcodes.ORI: {
        this.step = this.ORImmediate
        break
      }
      case opcodes.ANDI: {
        this.step = this.ANDImmediate
        break
      }
      case opcodes.ADDIU: {
        this.step = this.ADDUImmediate
        break
      }
      case opcodes.BEQ: {
        this.step = this.branchEqual
        break
      }
      case opcodes.BNE: {
        this.step = this.branchNotEqual
        break
      }
      default: this.step = this.fetchStep
    }
    return this.complete({
      ALUSourceB: 3
    })
  }

  // BEQ
  private branchEqual(opcode: number) {
    this.step = this.fetchStep
    return this.complete({
      ALUSourceA: 1,
      ALUOP: ALUOPs.SUB,
      PCConditionalWrite: 1,
      PCSource: 1
    })
  }

  // BNE
  private branchNotEqual(opcode: number) {
    this.step = this.fetchStep
    return this.complete({
      ALUSourceA: 1,
      ALUOP: ALUOPs.DIFF,
      PCConditionalWrite: 1,
      PCSource: 1
    })
  }

  // Tipo I
  private typeIWrite(opcode: number) {
    this.step = this.fetchStep
    return this.complete({
      RegisterBankWrite: 1
    })
  }

  // LUI
  private loadUpperImmediate(opcode: number) {
    this.step = this.typeIWrite
    return this.complete({
      ALUOP: ALUOPs.LUI,
      ALUSourceB: 2,
      shiftSource: 1
    })
  }

  // ORI
  private ORImmediate(opcode: number) {
    this.step = this.typeIWrite
    return this.complete({
      ALUOP: ALUOPs.ORI,
      ALUSourceA: 1,
      ALUSourceB: 2
    })
  }

  // ANDI
  private ANDImmediate(opcode: number) {
    this.step = this.typeIWrite
    return this.complete({
      ALUOP: ALUOPs.AND,
      ALUSourceA: 1,
      ALUSourceB: 2
    })
  }
  
  // ADDIU
  private ADDUImmediate(opcode: number) {
    this.step = this.typeIWrite
    return this.complete({
      ALUOP: ALUOPs.ADDU,
      ALUSourceA: 1,
      ALUSourceB: 2
    })
  }

  // Tipo R
  private typeRExecution(opcode: number) {
    this.step = this.typeRWrite
    return this.complete({
      ALUOP: ALUOPs.FUNCT,
      ALUSourceA: 1
    })
  }

  private typeRWrite(opcode: number) {
    this.step = this.fetchStep
    return this.complete({
      WriteRegister: 1,
      RegisterBankWrite: 1
    })
  }

  // Load word & Store word
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

  // Load word
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

  // Store word
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
      ALUOP: some.ALUOP || ALUOPs.ADDU,
      PCSource: some.PCSource || 0,
      shiftSource: some.shiftSource || 0
    }
  }
}

export default ControlUnit