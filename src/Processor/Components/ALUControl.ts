import { operations } from "./ALU"
import { ALUOPs } from "./Control"

const functs = {
  ADDU: 33,
  AND: 36,
  XOR: 38,
  SLT: 42,
  SLL: 0,
  SRL: 2
} 

class ALUControl {
  get(aluOp: number, funct: number) {
    switch (aluOp) {
      case ALUOPs.ADDU: return operations.ADDU
      case ALUOPs.AND: return operations.AND
      case ALUOPs.SUB: return operations.SUB
      case ALUOPs.LUI: return operations.SLL
      case ALUOPs.ORI: return operations.OR
      case ALUOPs.DIFF: return operations.DIFF
      case ALUOPs.FUNCT: switch (funct) {
        case functs.SLL: return operations.SLL
        case functs.SRL: return operations.SRL
        case functs.ADDU: return operations.ADDU
        case functs.AND: return operations.AND
        case functs.XOR: return operations.XOR
        case functs.SLT: return operations.SLT
      }
    }

    return operations.ADDU
  }
}

export default ALUControl