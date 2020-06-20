import Memory from "./Components/Memory";
import RegistersBank from "./Components/RegisterBank";
import Register from "./Components/Register";
import Mux from "./Components/Mux";
import ALU from "./Components/ALU";
import Split from "./Components/Split";

export function setup(){
  // Instanciamento de componentes
  // --- Unidade de controle ---

  // --- Etapa de acesso ---
  const PC = new Register(false, 0x400000) // PC, Registrador comum, iniciado com escrita desabilitada e valor em 0x400000
  const addressSource = new Mux(() => ({ // Multiplexador de endereço de acesso a memória
    0: PC.read(),
    1: aluOut.read()
  })) 
  const memory = new Memory([{address: 0x400000, value: 0x201821}]) // Memória, iniciada com os seus valores inseridos gravados
  const instructionRegister = new Register() // Registrador de instruções
  const dataRegister = new Register() // Registrador de dados

  // --- Etapa de decodificação ---
  const opCode = new Split(instructionRegister.read, [31, 26]) // Saída do registrador de instruções limitada ao trecho de opcode 31 - 26
  const rs = new Split(instructionRegister.read, [25, 21]) // Saída do registrador de instruções limitada ao trecho de source register 25 - 21
  const rt = new Split(instructionRegister.read, [20, 16]) // Saída do registrador de instruções limitada ao trecho de target register 20 - 16
  const rd = new Split(instructionRegister.read, [15, 11]) // Saída do registrador de instruções limitada ao trecho de source register 15 - 11
  const inmediate = new Split(instructionRegister.read, [15, 0]) // Saída do registrador de instruções limitada ao trecho do imediato register 15 - 0
  const funct = new Split(instructionRegister.read, [5, 0]) // Saída do registrador de instruções limitada ao trecho de função 5 - 0
  const registerBank = new RegistersBank() // Banco de registradores
  const A = new Register() // Registrador auxiliar A
  const B = new Register() // Registrador auxiliar B

  // --- Etapa de execução ---
  const aluSourceA = new Mux(() => ({ // Multiplexador do fonte A da ULA
    0: PC.read(),
    1: A.read()
  })) 
  const aluSourceB = new Mux(() => ({ // Multiplexador do fonte B da ULA
    0: B.read(),
    1: 4,
    2: inmediate.get(),
    3: inmediate.get() << 2,
  }))
  const alu = new ALU() // ULA

  // Etapa de escrita
  const jump = new Split(instructionRegister.read, [25, 0]) // Saída do registrador de instruções limitada ao trecho de jump 25 - 0
  const aluOut = new Register() // Saída da ULA, registrador comum
  const pcAddress = new Mux(() => ({ // Multiplexador do fonte B da ULA
    0: alu.read(),
    1: aluOut.read(),
    2: jump.get() << 2
  }))
  const writeRegister = new Mux(() => ({ // Multiplexador do endereço do registrador a ser escrito no banco de registradores
    0: rd.get(),
    1: rt.get()
  }))
  const writeData = new Mux(() => ({ // Multiplexador do dado a ser escrito no banco de registradores
    0: aluOut.read(),
    1: dataRegister.read()
  }))

  function display() {
    console.log('-- Cycle --')
    console.log('PC', PC.read())
    console.log('IR', instructionRegister.read()) 
    console.log('DR', dataRegister.read())
    console.log('ALU', alu.read())
    console.log('A', A.read())
    console.log('B', B.read())
    console.log('AluOut', aluOut.read())
  }

  PC.setWriteEnable(true)

  // Execução a cada ciclo de clock, primeiro ocorre todas as leituras, depois as escritas
  function tick() {
    const data = memory.read(
      addressSource.get(0)
    )
    instructionRegister.write(data)
    dataRegister.write(data)
  
    A.write(
      registerBank.read(
        rs.get()
      )
    )
    B.write(
      registerBank.read(
        rt.get()
      )
    )
  
    alu.calculate(
      0, 
      aluSourceA.get(0), 
      aluSourceB.get(1)
    )
    aluOut.write(
      alu.read()
    )
  
    registerBank.write(
      writeRegister.get(0),
      writeData.get(0)
    )
    
    PC.write(
      pcAddress.get(0)
    )
  }

  display()
  tick()
  display()
}

