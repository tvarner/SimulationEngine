/*
import _ from 'lodash';
import { combineReducers } from 'redux';

import {
	runSimulationEngine,
	stopSimulationEngine,
	exitSimulationEngine,
	initializeSimulation,
	runSimulation,
	stopSimulation,
	clearSimulation,
	initializeSimulationGUI,
	destroySimulationGUI,
	setSimulationViewControls,
} from './../../../../SimulationEngine/SimulationEngine';

function simulator(state = {
	running: false,
	renderLoopActive: false,
	viewControls: "orbit",
	sceneElement: 'simulator',
	simulation: {
		activeSimulationId: null,
		simulationControlsActive: false,
		running: false
	}
}, action) { 
	switch(action.type) { 
	case 'RUN_SIMULATOR':
		runSimulationEngine();
		return Object.assign({}, state, {
			running: true,
			renderLoopActive: true
		});
	case 'STOP_SIMULATOR':
		if (state.running === true) {
			stopSimulationEngine();
			return Object.assign({}, state, {
				renderLoopActive: false
			});
		} else { 
			return state;
		}
	case 'EXIT_SIMULATOR':
		exitSimulationEngine();
		return Object.assign({}, state, {
			running: false,
			renderLoopActive: false
		});
	case 'INITIALIZE_SIMULATION':
		// Simulations can only be re-initialized if activeSimulationId set back to null
		if (state.simulation.activeSimulationId === null) { 
			initializeSimulation();
			return Object.assign({}, state, {
				simulation: _.merge({}, state.simulation, {
					activeSimulationId: action.simulationId	
				})
			});
		} else {
			return state;
		}
	case 'RUN_SIMULATION':
		// TODO: add activeSimulation !== null check once loading/saving implemented
		if (state.running === true
			&& state.simulation.running === false
			&& state.simulation.activeSimulationId) {
			runSimulation(action.simulationId);
			return Object.assign({}, state, {
				simulation: _.merge({}, state.simulation, {
					running: true
				})
			});
		} else { 
			return state;
		}
	case 'STOP_SIMULATION':
		// TODO: add activeSimulation !== null check once loading/saving implemented
		if (state.simulation.running === true) {
			stopSimulation();
			return Object.assign({}, state, {
				simulation: _.merge({}, state.simulation, {
					running: false
				})
			});
		} else { 
			return state;
		}
	case 'CLEAR_SIMULATION':
		if (state.running === true) {
			clearSimulation();
			return Object.assign({}, state, {
				simulation: _.merge({}, state.simulation, {
					activeSimulationId: null,
					running: false
				})
			});
		} else { 
			return state;
		}
	case 'INITIALIZE_SIMULATION_GUI':
		if (state.running === true 
			&& state.simulation.activeSimulationId
			&& !state.simulation.simulationControlsActive) {
			initializeSimulationGUI();
			return Object.assign({}, state, {
				simulation: _.merge({}, state.simulation, {
					simulationControlsActive: true
				}) 
			});
		} else { 
			return state;
		}
	case 'DESTROY_SIMULATION_GUI':
		if (state.simulation.simulationControlsActive === true) {
			destroySimulationGUI();
			return Object.assign({}, state, {
				simulation: _.merge({}, state.simulation, {
					simulationControlsActive: false
				})
			});
		} else { 
			return state;
		}
	case 'SET_SIMULATION_VIEW_CONTROLS':
		if (action.controlsId === 'orbit' 
			|| action.controlsId === 'fly'
			|| action.controlsId === 'pointer') { 
			setSimulationViewControls(action.controlsId);
			return Object.assign({}, state, {
				viewControls: action.controlsId
			});		
		} else { 
			return state;
		}
	case 'LOAD_SIMULATION':
	case 'SAVE_SIMULATION':
	case 'SET_SCENE_ELEMENT':
	default: 
		return state;
	}
}

const simulatorView = combineReducers({
	simulator
});
*/

export default {};