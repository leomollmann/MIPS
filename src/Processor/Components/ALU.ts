export const operations = {
  AND: 0,
  OR: 1,
  ADDU: 2,
  XOR: 3,
  SLL: 4,
  SRL: 5,
  SUB: 6,
  SLT: 7,
  DIFF: 8
}

class ALU {
  private functions: Record<number, (a: number, b: number) => number> = {
    [operations.AND]: (a, b) => a & b,
    [operations.OR]: (a, b) => a | b,
    [operations.ADDU]: (a, b) => a + b,
    [operations.XOR]: (a, b) => a ^ b,
    [operations.SUB]: (a, b) => a - b,
    [operations.SLT]: (a, b) => a < b ? 1 : 0,
    [operations.SLL]: (_, b) => b << this.shamt,
    [operations.SRL]: (_, b) => b >> this.shamt,
    [operations.DIFF]: (a, b) => +(a === b)
  }
  private operation: number = 0
  private result: number = 0
  private shamt: number = 0

  setShiftAmount(amount: number) {
    this.shamt = amount
  }

  setControl(operation: number) {
    this.operation = operation
  }

  calculate(a: number, b: number) {
    this.result = (this.functions[this.operation] || this.functions[0])(a, b)
  }

  zero() {
    return +!this.result
  }

  read() {
    return this.result
  }

  display() {
    return {
      result: this.result,
      zero: this.zero(),
      operation: this.operation,
      shamt: this.shamt
    }
  }
}

export default ALU