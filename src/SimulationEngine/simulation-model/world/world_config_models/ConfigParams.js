/**
* Global simulator configurtion parameters accessible to all parts of the application and simulator
* 
*  //TODO: 	Integrate Length model, time model, variable interval into config params.
			Pass config params to engine in order to manipulate state space "properly".
*/
let instance = null;

export default class ConfigParams { 
	constructor(params) { 
		if(!instance) { 
			this.init(params);
			instance = this;
		}
	}

	init(params) { 
		this.params = params ? this.setParams(params) : {};
/*
		_.extend(this.params, {
			// configuration params go here
			// this.whatever = "whatever"
		})
*/
	}

	setParams(params) { 
		if (params) { 
			this.params = params;
		} else { 
			throw new Error("parameters undefined");
		}
	}
}

