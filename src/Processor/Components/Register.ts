class Register {
  constructor(
    private writeEnable: boolean = true,
    private value: number = 0
  ) {}

  read() {
    return this.value
  }

  write(value: number) {
    if(this.writeEnable)
      this.value = value
  }

  setWriteEnable(enable: boolean) { this.writeEnable = enable } 
}

export default Register