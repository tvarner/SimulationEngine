/**
* Global simulation length model accessible to all parts of the application and simulator
* 
* 
*/
let instance = null; 

export default class LengthModel { 

	constructor() { 
		if(!instance) { 
			this.init();
			instance = this;
		}
		return instance;
	}

	init() { 
		this.systemUnit = 'METER';
		this.simulationUnitLength = 1;
	}

	getSimulationLength(systemLength) { 
		return systemLength / this.simulationUnitLength;
	}

	getSystemLength(simulationLength) { 
		return simulationLength * this.simulationUnitLength;
	}
}