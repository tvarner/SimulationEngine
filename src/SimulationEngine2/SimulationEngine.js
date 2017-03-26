import ExampleSimulation from './Simulations/ExampleSimulation/ExampleSimulation';
// import store from './../app/store/configureStore';
// import _ from 'lodash';

const Engine = {

	runSimulation: function() {
		// STOPPED HERE?? 3/24/17
		// debugger;

		// This while loop is representative of the rendor loop.
		// At each iteration, conditional events are checked and all
		// bounded events are executed. Events dispatch actions that 
		// are received by the reducer in order to update state.
		while(!ExampleSimulation.stopCondition()) {
			ExampleSimulation.checkConditionalEvents();
			ExampleSimulation.executeBoundedEvents();
		}
	}
};

export default Engine;