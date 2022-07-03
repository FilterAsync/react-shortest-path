import React, { useState } from 'react';
import { removeAllSpaces, strToCoord, isValidMatrixStr, getRandomEntry } from './util';
import BFS from './bfs';
import Matrix from './components/Matrix';
import Controller from './components/Controller';
import matrices from './matrices.json';
import MatrixContext from './MatrixContext';
import { wait } from './util';

const randomMatrix = getRandomEntry(matrices);

function App() {
	const [matrix, setMatrix] = useState(randomMatrix.matrix);
	const [source, setSource] = useState(randomMatrix.source);
	const [dest, setDest] = useState(randomMatrix.dest);

	const [error, setError] = useState('');

	const [speed, setSpeed] = useState(10);

	const onSpeedChanged = (event) => {
		setSpeed(+event.target.value);
	};

	const onSubmit = async (event) => {
		event.preventDefault();
		const [row1, col1] = source;
		const [row2, col2] = dest;
		let _matrix;
		if (typeof structuredClone === 'function') {
			_matrix = structuredClone(matrix);
		} else {
			_matrix = Object.assign([], matrix);
		}
		const shortestPath = BFS(_matrix, row1, col1, row2, col2);
		if (shortestPath === -1) {
			setError('Invalid source or destination.');
			return;
		}
		shortestPath.reverse();
		for (const [row, col] of shortestPath) {
			const entry = document.getElementById(`${row},${col}`);
			await wait(speed);
			entry.style.backgroundColor = '#ebc634';
		}
		setError('');
	};

	const onMatrixChanged = (event) => {
		const str = removeAllSpaces(event.target.value);
		const validate = isValidMatrixStr(str);
		if (!validate) {
			setError('Invalid matrix representation.');
			return;
		}
		setError('');
		try {
			setMatrix(JSON.parse(str));
		} catch (err) {}
	};

	const onSourceChanged = (event) => {
		const str = removeAllSpaces(event.target.value);
		const coord = strToCoord(str);
		if (!coord) {
			setError('Invalid coordinates.');
			return;
		}
		setError('');
		setSource(coord);
	};

	const onDestChanged = (event) => {
		const str = removeAllSpaces(event.target.value);
		const coord = strToCoord(str);
		if (!coord) {
			setError('Invalid coordinates.');
			return;
		}
		setError('');
		setDest(coord);
	};

	const events = {
		onSubmit,
		onMatrixChanged,
		onSourceChanged,
		onDestChanged,
		onSpeedChanged,
	};

	return (
		<MatrixContext.Provider
			value={{
				matrix,
				source,
				dest,
			}}
		>
			<div className="flex-container center">
				<div>
					<h2>Matrix Representation</h2>
					<Matrix error={!!error} />
				</div>
				<div>
					<h2>Matrix Controller</h2>
					<Controller {...{ error, ...events }} />
				</div>
			</div>
			<hr />
			<div>
				<a
					href="https://github.com/FilterAsync/react-shortest-path"
					target="_blank"
					rel="noopener noreferrer"
					title="Github repository"
				>
					<svg
						aria-label="Github"
						aria-hidden={true}
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
					>
						<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
					</svg>
				</a>
			</div>
		</MatrixContext.Provider>
	);
}

export default App;
