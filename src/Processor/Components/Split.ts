class Split{
  private value: () => number
  private left: number = 0
  private rigth: number = 0

  constructor(
    value: () => number,
    range: [number, number]
  ) {
    this.value = value
    this.left = 31 - range[0]
    this.rigth = range[1]
  }

  get() {
    return (this.value() >> this.rigth) << this.left
  }
}

export default Split