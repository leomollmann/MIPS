import React, { useState } from 'react'
import './App.css'
import FileInput from 'Web/FileInput'
import Simulator from 'Web/Simulator'
import Data from 'Processor/Entities/Data'

function App() {
	const [uploading, setUploading] = useState(true)
	const [instructionsData, setInstructionsData] = useState<Data[]>()
	const [memoryData, setMemoryData] = useState<Data[]>()

	if(!uploading) return <Simulator data={instructionsData!.concat(memoryData || [])} />

	return (
		<>
			<FileInput
				instructionsData={instructionsData}
				memoryData={memoryData}
				setInstructionsData={setInstructionsData} 
				setMemoryData={setMemoryData} 
			/>
			{instructionsData && (
				<div
					className="procede"
					onClick={() => setUploading(false)}
				>
					Ir para o simulador
				</div>
			)}
		</>
	)
}

export default App
