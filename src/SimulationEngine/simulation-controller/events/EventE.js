export default class EventE { 

	constructor(engine) {
		this.engine = engine;
		this.stateSpace = engine.stateSpace;
		// this.scene = engine.scene;
		this.eventId = "Event E";

		this.executionTime;
		this.data;
	}

	initialize(executionTime, data) {
		this.executionTime = executionTime;
		this.data = data;
	}
	
	run() {
		// update state space
		this.stateSpace.message = "Executed event E";

		// for mobile agents, use accelerate() to update accel. instead of directly setting accel.,
		// in order to incorporate mobile agent specific acceleration logic    

		// TODO: Need to think about how model objects (particularly system agents) are exposed to and updated by the controller.
		// and then updated in the view. lock down that flow;

		// generate next event(s). Pass necessary data to next event in data object
		const data = {};
		this.engine.generateEvent("Event A", this.executionTime + 10, data);
	}
}