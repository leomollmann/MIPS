import React, { useRef, useState } from 'react'
import Data from 'Processor/Entities/Data'
import { setup } from 'Processor/main'

type Props = {
	data: Data[]
}

function Simulator({ data }: Props) {
  const mips = useRef(setup(data))
  const [values, setValues] = useState<ReturnType<typeof mips.current>>()

  function next() {
    const values = mips.current()
    setValues(values)
    console.log(values)
  }

  return (
    <div className="container">
      <div className="memory">
        {values?.memory.map(({address, value}) => (
          <div className="dataset" key={address}>
            <h2>0x{parseInt(address).toString(16)}:</h2>
            <h2>0x{value.toString(16)}</h2>
          </div>
        ))}
      </div>
      <div onClick={next}>Next</div>
    </div>
  )
}

export default Simulator
