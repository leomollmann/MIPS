import Memory from "./Components/Memory";
import RegistersBank from "./Components/RegisterBank";
import Register from "./Components/Register";
import Mux from "./Components/Mux";
import ALU from "./Components/ALU";
import Split from "./Components/Split";
import ControlUnit from "./Components/Control";
import ALUControl from "./Components/ALUControl";
import Data from "./Entities/Data";

export const PCStart = 0x400000
export const DataStart = 0x10010000

export function setup(data: Data[]){
  // Instanciamento de componentes
  // --- Unidade de controle ---
  const controlUnit = new ControlUnit()
  // --- Etapa de acesso ---
  const PC = new Register(false, PCStart) // PC, Registrador comum, iniciado com escrita desabilitada e valor em 0x400000
  const addressSource = new Mux(() => ({ // Multiplexador de endereço de acesso a memória
    0: PC.read(),
    1: aluOut.read()
  })) 
  const memory = new Memory(data) // Memória, iniciada com os seus valores inseridos gravados
  const instructionRegister = new Register() // Registrador de instruções
  const dataRegister = new Register() // Registrador de dados

  // --- Etapa de decodificação ---
  const opcode = new Split(() => instructionRegister.read(), [31, 26]) // Saída do registrador de instruções limitada ao trecho de opcode 31 - 26
  const rs = new Split(() => instructionRegister.read(), [25, 21]) // Saída do registrador de instruções limitada ao trecho de source register 25 - 21
  const rt = new Split(() => instructionRegister.read(), [20, 16]) // Saída do registrador de instruções limitada ao trecho de target register 20 - 16
  const rd = new Split(() => instructionRegister.read(), [15, 11]) // Saída do registrador de instruções limitada ao trecho de source register 15 - 11
  const immediate = new Split(() => instructionRegister.read(), [15, 0]) // Saída do registrador de instruções limitada ao trecho do imediato register 15 - 0
  const funct = new Split(() => instructionRegister.read(), [5, 0]) // Saída do registrador de instruções limitada ao trecho de função 5 - 0
  const registerBank = new RegistersBank() // Banco de registradores
  const A = new Register() // Registrador auxiliar A
  const B = new Register() // Registrador auxiliar B

  // --- Etapa de execução ---
  const aluSourceA = new Mux(() => ({ // Multiplexador do fonte A da ULA
    0: PC.read(),
    1: A.read(),
    2: immediate.get()
  })) 
  const aluSourceB = new Mux(() => ({ // Multiplexador do fonte B da ULA
    0: B.read(),
    1: 4,
    2: immediate.get(),
    3: immediate.get() << 2,
    4: 16
  }))
  const aluCtrl = new ALUControl() // Circuito combinacional de controle da ULA
  const alu = new ALU() // ULA

  // Etapa de escrita
  const jump = new Split(() => instructionRegister.read(), [25, 0]) // Saída do registrador de instruções limitada ao trecho de jump 25 - 0
  const aluOut = new Register() // Saída da ULA, registrador comum
  const pcAddress = new Mux(() => ({ // Multiplexador do fonte B da ULA
    0: alu.read(),
    1: aluOut.read(),
    2: jump.get() << 2
  }))
  const writeRegister = new Mux(() => ({ // Multiplexador do endereço do registrador a ser escrito no banco de registradores
    0: rt.get(),
    1: rd.get()
  }))
  const writeData = new Mux(() => ({ // Multiplexador do dado a ser escrito no banco de registradores
    0: aluOut.read(),
    1: dataRegister.read()
  }))

  // Execução a cada ciclo de clock, primeiro ocorre todas as leituras, depois as escritas
  function tick() {
    // Começo do clock
    const signals = controlUnit.step(opcode.get()) // Armazena os sinais vindo da máquina de estados

    memory.setReadEnable(!!signals.ReadMemory)
    const data = memory.read(
      addressSource.get(signals.PCOrALU)
    ) // Lê a memória na posição definida pelo multiplexador 
    instructionRegister.setWriteEnable(!!signals.IRWrite)
    instructionRegister.write(data) // Armazena a instrução, fica disponível para os próximos ciclos
    dataRegister.write(data) // Armazena o valor que retorna da memória, utilizado em LW e SW
  
    A.write( // Escreve no registrador A
      registerBank.read( // a leitura do banco de registradores na posição 
        rs.get() // range responsável pelo source
      )
    ) 
    B.write( // Escreve no registrador B
      registerBank.read( // a leitura do banco de registradores na posição 
        rt.get() // range responsável pelo target
      )
    )

    memory.setWriteEnable(!!signals.WriteMemory)
    memory.write( // Escreve na memória
      pcAddress.get(signals.PCSource), // no endereço provido pelo multiplexador
      B.read() // o conteúdo do registrador B
    )
  
    alu.setControl(aluCtrl.compute(signals.ALUOP, funct.get())) // Calcula o controle da ULA
    alu.calculate( // Executa a operação
      aluSourceA.get(signals.ALUSourceA), // com o valor provido pelo multiplexador SourceA
      aluSourceB.get(signals.ALUSourceB) // e pelo multiplexador SourceB
    )
    aluOut.write( // Escreve o resultado da ULA no registrador de saída da ULA
      alu.read()
    )

    PC.setWriteEnable(!!signals.PCWrite || (!!signals.PCConditionalWrite && !!alu.zero()))
    PC.write( // Escreve o valor do PC
      pcAddress.get(signals.PCSource) // provido pelo multiplexador pcAddress
    )

    registerBank.setWriteEnable(!!signals.RegisterBankWrite)
    registerBank.write( // Escreve no banco de registradores
      writeRegister.get(signals.WriteRegister), // o endereço provido pelo multiplexador writeRegister
      writeData.get(signals.MemoryToRegister) // o valor provido pelo multiplexador writeData
    )
    
    // Termina o clock, avisando aos registradores sobre a falling edge
    PC.tick()
    instructionRegister.tick()
    dataRegister.tick()
    A.tick()
    B.tick()
    aluOut.tick()
    registerBank.tick()

    // retorna os valores dos barramentos e memórias
    return {
      signals,
      PC: PC.read(),
      addressSource: addressSource.display(),
      memory: memory.display(),
      instructionRegister: instructionRegister.read(),
      dataRegister: dataRegister.read(),
      opcode: opcode.get(),
      rs: rs.get(),
      rt: rt.get(),
      rd: rd.get(),
      immediate: immediate.get(),
      funct: funct.get(),
      registerBank: registerBank.display(),
      A: A.read(),
      B: B.read(),
      aluSourceA: aluSourceA.display(),
      aluSourceB: aluSourceB.display(),
      alu: alu.display(),
      jump: jump.get(),
      aluOut: aluOut.read(),
      pcAddress: pcAddress.display(),
      writeRegister: writeRegister.display(),
      writeData: writeData.display()
    }
  }

  return tick
}

