import { combineReducers } from 'redux';

import SimulationEngine from './../../../../SimulationEngine/SimulationEngine';

function simulationEngine(state = {
	simulatorInitialized: false,
	sceneElement: 'simulationEngine'
}, 
	action) { 
	switch(action.type) { 
	case 'INITIALIZE_SIMULATOR':
		if (!state.simulatorInitialized) { 
			SimulationEngine.initializeSimulationEngine();
		}
		return Object.assign({}, state, {
			simulatorInitialized: true
		});
	case 'PLAY_SIMULATOR':
		SimulationEngine.playSimulationEngine();
		return state;
	case 'PAUSE_SIMULATOR':
		SimulationEngine.pauseSimulationEngine();
		return state;
	case 'EXIT_SIMULATOR':
		if (state.simulatorInitialized) { 
			SimulationEngine.closeSimulationEngine();
		}
		return Object.assign({}, state, {
			simulatorInitialized: false
		});
	case 'SET_ACTIVE_SIMULATION':
		if (action.simulationId) { 
			SimulationEngine.setActiveSimulation(action.simulationId);
		}
		return state;
	case 'INITIALIZE_SIMULATION':
		SimulationEngine.initializeSimulation();
		return state;
	case 'PLAY_SIMULATION':
		SimulationEngine.playSimulation();
		return state;
	case 'PAUSE_SIMULATION':
		SimulationEngine.pauseSimulation();
		return state;
	case 'CLEAR_SIMULATION':
		if (action.reinitializeScene !== undefined) { 
			SimulationEngine.clearSimulation(action.reinitializeScene);
		}
		return state;
	case 'INITIALIZE_SIMULATION_GUI':
		SimulationEngine.initializeSimulationGUI();
		return state;
	case 'DESTROY_SIMULATION_GUI':
		SimulationEngine.destroySimulationGUI();
		return state;
	case 'SET_SIMULATION_VIEW_CONTROLS':
		if (action.controlsId) { 
			SimulationEngine.setSimulationViewControls(action.controlsId);
		}
		return state;
	case 'LOAD_SIMULATION':
	case 'SAVE_SIMULATION':
	default: 
		return state;
	}
}

const simulatorView = combineReducers({
	simulationEngine
});

export default simulatorView;