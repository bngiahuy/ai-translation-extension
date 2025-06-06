import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
function App() {
	const [color, setColor] = useState('');
	const handleClick = async () => {
		let [tab] = await chrome.tabs.query({
			active: true,
			currentWindow: true,
		});
		chrome.scripting.executeScript({
			target: { tabId: tab.id! },
			args: [color],
			func: (color: string) => {
				document.body.style.backgroundColor = color;
			},
		});
	};
	return (
		<>
			<div>
				<a href="https://vite.dev" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>
			<h1>Vite + React</h1>
			<div className="card">
				<input
					type="color"
					defaultValue="#61dafb"
					onChange={(event) => setColor(event.target.value)}
				/>
				<button onClick={() => handleClick()}>Click me!</button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">
				Click on the Vite and React logos to learn more
			</p>
		</>
	);
}

export default App;
