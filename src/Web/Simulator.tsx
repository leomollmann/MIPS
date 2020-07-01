import React, { useRef, useState } from 'react'
import Data from 'Processor/Entities/Data'
import { setup } from 'Processor/main'

type Props = {
	data: Data[]
}

function Simulator({ data }: Props) {
  const mips = useRef(setup(data))
  const [values, setValues] = useState<ReturnType<typeof mips.current.tick>>(mips.current.initialValues)

  function next() {
    const values = mips.current.tick()
    setValues(values)
    console.log(values)
  }

  return (
    <div className="container">
      <div className="main">
        <div className="next-btn" onClick={next}>Próximo</div>
        <h3>Estado: {values.signals.stage}</h3>
      </div>
      <div className="memory">
        <h3>Memória</h3>
        <h3>PC: {values.PC.toString(16)}</h3>
        {values.memory.map(({address, value}) => (
          <div className="dataset" key={address}>
            <h2>0x{parseInt(address).toString(16)}:</h2>
            <h2>0x{value.toString(16)}</h2>
          </div>
        ))}
      </div>
      <div className="instruction">
        <h3>Instrução</h3>
        <h2>opcode: {values.opcode}</h2>
        <h2>rs {values.rs}</h2>
        <h2>rt {values.rt}</h2>
        <h2>rd {values.rd}</h2>
        <h2>immediate {values.immediate}</h2>
        <h2>negativeImmediate {values.negativeImmediate}</h2>
        <h2>funct: {values.funct}</h2>
        <h2>shamt {values.shamt}</h2>
      </div>
      <div className="regbank">
        <h3>Banco de Registradores</h3>
        {values.registerBank.map(({address, value}) => (
          <div className="dataset" key={address}>
            <h2>{address}:</h2>
            <h2>0x{value.toString(16)}</h2>
          </div>
        ))}
      </div>
      <div>
        <h3>Valores da ULA</h3>
        <h2>A: {values.A}</h2>
        <h2>B: {values.B}</h2>
        <h2>Fonte ULA A: (selecionado {values.signals.ALUSourceA})</h2>
        {Object.entries(values.aluSourceA).map(([key, value]) => (
          <div className="dataset" key={key}>
            <h2>{key}:</h2>
            <h2>{value}</h2>
          </div>
        ))}
        <h2>Fonte ULA B: (selecionado {values.signals.ALUSourceB})</h2>
        {Object.entries(values.aluSourceB).map(([key, value]) => (
          <div className="dataset" key={key}>
            <h2>{key}:</h2>
            <h2>{value}</h2>
          </div>
        ))}
        <h3>ULA</h3>
        <h2>Operação: {values.alu.operation}</h2>
      </div>
    </div>
  )
}

export default Simulator
