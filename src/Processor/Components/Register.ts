class Register {
  private risingEdgeValue: number = 0
  private fallingEdgeValue = this.risingEdgeValue
  private writeEnable: boolean = true

  constructor(
    writeEnable?: boolean,
    risingEdgeValue?: number
  ) {
    if(writeEnable !== undefined) this.writeEnable = writeEnable
    if(risingEdgeValue !== undefined) this.risingEdgeValue = risingEdgeValue
  }

  read() {
    return this.risingEdgeValue
  }

  write(value: number) {
    if(this.writeEnable)
      this.fallingEdgeValue = value
  }

  tick() {
    this.risingEdgeValue = this.fallingEdgeValue
  }

  setWriteEnable(enable: boolean) { this.writeEnable = enable } 
}

export default Register