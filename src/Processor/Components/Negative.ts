class Negative {
  private value: () => number
  private bits: number = 0

  constructor(
    value: () => number,
    bits: number
  ) {
    this.value = value
    this.bits = Math.pow(2, bits)
  }

  get() {
    const value = this.value()
    return value > (this.bits >> 1) ? value - this.bits : value
  } 
}

export default Negative