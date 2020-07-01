import React from 'react'
import Data from 'Processor/Entities/Data'
import { PCStart, DataStart } from 'Processor/main'

type Props = {
	memoryData?: Data[]
	instructionsData?: Data[]
	setInstructionsData(data?: Data[]): void
	setMemoryData(file?: Data[]): void
}

function FileInput({ setInstructionsData, setMemoryData, instructionsData, memoryData }: Props) {
	function handleInstructionsChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = (e.target.files || [])[0]
		if(file) {
			let counter = PCStart - 4
			const getAddress = () => {
				counter += 4
				return counter
			}

			const reader = new FileReader()
			reader.onload = event => {
				setInstructionsData(
					(event.target!.result as string)
					.split('\n')
					.slice(0, -1)
					.map(line => ({address: getAddress(), value: parseInt(line, 16)}))
				)
			};
			reader.readAsText(file)
		} else setInstructionsData()
	}

	function handleDataChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = (e.target.files || [])[0]
		if(file) {
			let counter = DataStart - 4
			const getAddress = () => {
				counter += 4
				return counter
			}

			const reader = new FileReader()
			reader.onload = event => {
				setMemoryData(
					(event.target!.result as string)
					.split('\n')
					.slice(0, -1)
					.map(line => parseInt(line, 16))
					.filter(line => line)
					.map(line => ({address: getAddress(), value: line}))
				)
			};
			reader.readAsText(file)
		} else setMemoryData()
	}

	return (
		<div className="container">
			<div className="instructions">
				<label>
					<h1>Instruções</h1>
					{instructionsData ? instructionsData.map(({address, value}) => (
						<div className="dataset" key={address}>
							<h2>0x{address.toString(16)}:</h2>
							<h2>0x{value.toString(16)}</h2>
						</div>
					)) : (
						<>
							<h3>Clique aqui para adicionar o arquivo exportado em hexadecimal</h3>
							<h2>addu $3, $1, $0</h2>
						</>
					)}
					<input type="file" onChange={handleInstructionsChange}/>
				</label>
			</div>
			<div className="data">
				<label>
					<h1>Dados</h1>
					{memoryData ? memoryData.map(({address, value}) => (
						<div className="dataset" key={address}>
							<h2>0x{address.toString(16)}:</h2>
							<h2>0x{value.toString(16)}</h2>
						</div>
					)) : (
						<>
							<h3>Clique aqui para adicionar o arquivo exportado em hexadecimal</h3>
							<h2>data1: 0xF</h2>
						</>
					)	}
					<input type="file" onChange={handleDataChange}/>
				</label>
			</div>
		</div>
	)
}

export default FileInput
