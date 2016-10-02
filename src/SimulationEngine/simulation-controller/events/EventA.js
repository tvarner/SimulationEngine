// import * as _ from 'lodash';
// import * as THREE from 'three';

export default class EventA { 
	constructor(engine) { 
		this.engine = engine;
		this.stateSpace = engine.stateSpace;
		// this.scene = engine.scene;
		this.eventId = "Event A";

		this.executionTime;
		this.data;
	}

	initialize(executionTime, data) {
		this.executionTime = executionTime;
		this.data = data;
	}

	// If event is Conditional, then executionCondition is required
	executionCondition() { 

	}

	run() {
		// update state space
		this.stateSpace.message = "Executed event A";
		// this.stateSpace.vehicle.a = 1.0;  

		// for mobile agents, use accelerate() to update accel. instead of directly setting accel.,
		// in order to incorporate mobile agent specific acceleration logic    

		// TODO: Need to think about how model objects (particularly system agents) are exposed to and updated by the controller.
		// and then updated in the view. lock down that flow

		// generate next event(s). Pass event name, execution time,
		// and any other necessary data to next event
		// TODO: add considerations of passing data to future events
		const data = {};

		// TODO: Make event executionTime correspond to the system executionTime (in ms) in the view

		this.engine.generateEvent("Event B", this.executionTime + 10, data);
	}

	completionCheck() { 

	} 

	completionCallback() { 

	}
}