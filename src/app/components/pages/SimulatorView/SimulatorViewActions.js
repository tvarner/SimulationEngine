export function initializeSimulator() { 
	return { 
		type: 'INITIALIZE_SIMULATOR'
	};
}

export function playSimulator() { 
	return {
		type: 'PLAY_SIMULATOR'
	};
}

export function pauseSimulator() {
	return { 
		type: 'PAUSE_SIMULATOR'
	};
}

export function exitSimulator() {
	return {
		type: 'EXIT_SIMULATOR'
	};
}

export function setActiveSimulation(simulationId) { 
	return {
		type: 'SET_ACTIVE_SIMULATION',
		simulationId: simulationId
	};
}

export function initializeSimulation() {
	return {
		type: 'INITIALIZE_SIMULATION'
	};
}

export function playSimulation() {
	return { 
		type: 'PLAY_SIMULATION'
	};
}

export function pauseSimulation() {
	return { 
		type: 'PAUSE_SIMULATION'
	};
}

export function clearSimulation() {
	return { 
		type: 'CLEAR_SIMULATION'
	};
}

export function loadSimulation(simulationId) {
	return {
		type: 'LOAD_SIMULATION',
		simulationId: simulationId
	};
}

export function saveSimulation() {
	return { 
		type: 'SAVE_SIMULATION'
	};
}

export function initializeSimulationGUI() {
	return {
		type: 'INITIALIZE_SIMULATION_GUI'
	};
}

export function destroySimulationGUI() {
	return {
		type: 'DESTROY_SIMULATION_GUI'
	};
}

export function setSimulationViewControls(controlsId) { 
	return { 
		type: 'SET_SIMULATION_VIEW_CONTROLS',
		controlsId: controlsId
	};
}