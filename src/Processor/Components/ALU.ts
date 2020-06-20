class ALU {
  private operations: Record<number, (a: number, b: number) => number> = {
    0: (a, b) => a + b,
    1: (a, b) => a - b
  }

  private result: number = 0

  calculate(operation: number, a: number, b: number) {
    this.result = (this.operations[operation] || this.operations[0])(a, b)
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
      zero: this.zero()
    }
  }
}

export default ALU