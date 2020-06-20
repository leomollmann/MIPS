class RegistersBank {
  private registers: Record<number, number> = {
    0: 0,
    1: 0,
    2: 0, 
    3: 0,
    4: 0,
    5: 0, 
    6: 0, 
    7: 0, 
    8: 0, 
    9: 0, 
    10: 0, 
    11: 0, 
    12: 0, 
    13: 0, 
    14: 0, 
    15: 0, 
    16: 0, 
    17: 0, 
    18: 0, 
    19: 0, 
    20: 0, 
    21: 0, 
    22: 0, 
    23: 0, 
    24: 0, 
    25: 0, 
    26: 0, 
    27: 0, 
    28: 0, 
    29: 0, 
    30: 0, 
    31: 0
  }
  private writeEnable: boolean = false
  
  setWriteEnable(enable: boolean) { this.writeEnable = enable }

  read(register: number) {
    return this.registers[register] || 0
  }

  write(writeRegister: number, value: number) {
    if(this.writeEnable)
      this.registers[writeRegister] = value
  }
}

export default RegistersBank