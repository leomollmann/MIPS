import { operations } from "./ALU"
import { ALUOPs } from "./Control"

const functs = {
  ADDU: 33,
  AND: 36,
  XOR: 38,
  SLT: 42,
} 

class ALUControl {
  compute(aluOp: number, funct: number) {
    switch (aluOp) {
      case ALUOPs.ADDU: return operations.ADDU
      case ALUOPs.AND: return operations.AND
      case ALUOPs.SUB: return operations.SUB
      case ALUOPs.LUI: return operations.SLL
      case ALUOPs.ORI: return operations.OR
      case ALUOPs.FUNCT: switch (funct) {
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