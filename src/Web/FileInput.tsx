import React from 'react'

type Props = {
	onFile(file: File): void
}

function FileInput({ onFile }: Props) {
	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = (e.target.files || [])[0]

		if (file) onFile(file)
	}

	return (
		<label>
			<h1>Simulador MIPS</h1>
			<h3>Clique aqui para adicionar o arquivo</h3>
			<input onChange={handleChange} type="file" multiple={false} />
		</label>
	)
}

export default FileInput
