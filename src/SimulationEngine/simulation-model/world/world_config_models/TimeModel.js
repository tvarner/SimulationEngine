/**
* Global simulator time model accessible to all parts of the application and simulator
* //TODO: edit description
* 
*/
let instance = null;

export default class TimeModel { 
	constructor() { 
		if (!instance) { 
			this.init();
			instance = this;
		}
		return instance;
	}

	init() { 
		this.AGENT_UPDATE_FREQUENCY = 0.10;
		this.AGENT_UPDATE_INTERVAL = 100.00; // ms (minimum value for setTimeout(), setInterval() functions is 4ms as per HTML5)
	}
}