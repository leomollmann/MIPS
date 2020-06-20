class Split{
  private value: () => number
  private left: number = 0
  private rigth: number = 0

  constructor(
    value: () => number,
    range: [number, number]
  ) {
    this.value = value
    this.left = range[0] - range[1] + 1
    this.rigth = range[1]
  }

  get() {
    return ((1 << this.left) - 1) & (this.value() >> this.rigth)
  }
}

export default Split