import simulationActionTypes from './ExampleSimulationActionTypes';

// System state
function simulation(state = {
	simulationMessage1: "Some simulation message",
	simulationMessage2: "Some simulation message",
	simulationMessage3: "Some simulation message",
}, action) { 
	switch(action.type) {
	case simulationActionTypes.UPDATE_SIMLUTION_MESSAGE_1:
		if (action.message) { 
			return Object.assign({}, state, {
				simulationMessage1: action.message
			});
		} else { 
			return state;
		}
	case simulationActionTypes.UPDATE_SIMLUTION_MESSAGE_2:
		if (action.message) { 
			return Object.assign({}, state, {
				simulationMessage2: action.message
			});
		} else { 
			return state;
		}
	case simulationActionTypes.UPDATE_SIMLUTION_MESSAGE_3:
		if (action.message) { 
			return Object.assign({}, state, {
				simulationMessage3: action.message
			});
		} else { 
			return state;
		}
	default: 
		return state;
	}
}

export default simulation;