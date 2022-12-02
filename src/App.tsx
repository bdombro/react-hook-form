import {useState} from 'react'
import {Registration} from './components/Registration'
import {StressTest} from './components/StressTest'

export default function App() {
	const [mode, setMode] = useState(0)

	return (
		<div className="App">
			<h1>React Hook Form</h1>
			<div className="button-group">
				<button type="button" data-active={mode === 0} onClick={() => setMode(0)}>
					Normal Mode
				</button>
				<button type="button" data-active={mode === 1} onClick={() => setMode(1)}>
					Stress Mode
				</button>
			</div>
			{!mode && <Registration />}
			{mode && <StressTest />}
		</div>
	)
}
