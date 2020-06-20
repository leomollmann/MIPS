import React from 'react'
import './App.css'
import FileInput from 'Web/FileInput'
import { setup } from 'Processor/main'

function App() {
	setup()

	return <FileInput onFile={console.log} />
}

export default App
