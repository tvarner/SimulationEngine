import { combineReducers } from 'redux';
import SimulationEngine from './../../../../SimulationEngine/SimulationEngine';

const engine = new SimulationEngine();

function simulationEngine(state = {
	simulatorInitialized: false,
	sceneElement: 'simulationEngine'
}, 
	action) { 
	switch(action.type) { 
	case 'INITIALIZE_SIMULATOR':
		if (!state.simulatorInitialized) { 
			engine.initializeSimulationEngine();
		}
		return Object.assign({}, state, {
			simulatorInitialized: true
		});
	case 'PLAY_SIMULATOR':
		engine.playSimulationEngine();
		return state;
	case 'PAUSE_SIMULATOR':
		engine.pauseSimulationEngine();
		return state;
	case 'EXIT_SIMULATOR':
		if (state.simulatorInitialized) { 
			engine.closeSimulationEngine();
		}
		return Object.assign({}, state, {
			simulatorInitialized: false
		});
	case 'SET_ACTIVE_SIMULATION':
		if (action.simulationId) { 
			engine.setActiveSimulation(action.simulationId);
		}
		return state;
	case 'INITIALIZE_SIMULATION':
		engine.initializeSimulation();
		return state;
	case 'PLAY_SIMULATION':
		engine.playSimulation();
		return state;
	case 'PAUSE_SIMULATION':
		engine.pauseSimulation();
		return state;
	case 'CLEAR_SIMULATION':
		engine.clearSimulation();
		return state;
	case 'INITIALIZE_SIMULATION_GUI':
		engine.initializeSimulationGUI();
		return state;
	case 'DESTROY_SIMULATION_GUI':
		engine.destroySimulationGUI();
		return state;
	case 'SET_SIMULATION_VIEW_CONTROLS':
		if (action.controlsId) { 
			engine.setSimulationViewControls(action.controlsId);
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