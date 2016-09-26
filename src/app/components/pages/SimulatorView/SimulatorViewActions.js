export function _runSimulator() { 
	return { 
		type: 'RUN_SIMULATOR'
	};
}

export function _stopSimulator() {
	return { 
		type: 'STOP_SIMULATOR'
	};
}

export function _exitSimulator() {
	return {
		type: 'EXIT_SIMULATOR'
	};
}

export function _initializeSimulation(simulationId) {
	return {
		type: 'INITIALIZE_SIMULATION',
		simulationId: simulationId
	};
}

export function _runSimulation(simulationId) {
	return { 
		type: 'RUN_SIMULATION',
		simulationId: simulationId
	};
}

export function _stopSimulation(simulationId) {
	return { 
		type: 'STOP_SIMULATION',
		simulationId: simulationId
	};
}

export function _clearSimulation() {
	return { 
		type: 'CLEAR_SIMULATION'
	};
}

export function _loadSimulation(simulationId) {
	return { 
		type: 'LOAD_SIMULATION',
		simulationId: simulationId
	};
}

export function _saveSimulation(simulationId) {
	return { 
		type: 'SAVE_SIMULATION',
		simulationId: simulationId
	};
}

export function _initializeSimulationGUI() {
	return {
		type: 'INITIALIZE_SIMULATION_GUI'
	};
}

export function _destroySimulationGUI() {
	return {
		type: 'DESTROY_SIMULATION_GUI'
	};
}

export function _setSimulationViewControls(controlsId) { 
	return { 
		type: 'SET_SIMULATION_VIEW_CONTROLS',
		controlsId: controlsId
	};
}

export function _setSceneElement() { 
	return {
		type: 'SET_SCENE_ELEMENT'
	};
}