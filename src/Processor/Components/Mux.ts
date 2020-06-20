class Mux {
  private inputs: () => Record<number, number> = () => ({})

  constructor(inputs: () => Record<number, number>) {
    this.inputs = inputs
  }

  get(position: number) {
    return this.inputs()[position] || 0
  }

  display() {
    return this.inputs()
  }
}

export default Mux