// import SimulationActions from './ExampleSimulationActions';
import _ from 'lodash';

// need to evaluate state here?
const ExampleSimulation = {

	boundedEvents: [],
	
	stopCondition: function() { 
		return true;
	},

	checkConditionalEvents: function() { 
		if (this.executionCondition1()) { 
			// dispatch event/action to update state
		} else if (this.executionCondition2()) { 
			// dispatch event/action to update state
		} else if (this.executionCondition3()) { 
			// dispatch event/action to update state
		}
	},

	executeBoundedEvents: function() {
		_.each(this.boundedEvents, (boundedEvent) => { 
			if (!boundedEvent.checkStopConditions()) {
				// boundedEvent.runSimulation() dispatches events/actions to update state
				boundedEvent.runSimulation();
			}
		});
	},

	executionCondition1: function() { 
		return false;
	}, 

	executionCondition2: function() { 
		return false;
	}, 

	executionCondition3: function() { 
		return false;
	}
};

export default ExampleSimulation;