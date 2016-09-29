import * as _ from 'lodash';
import * as THREE from 'three';

export default class VariableInterval { 

	constructor(engine) {
		this.engine = engine;
	}

	setVariableInterval(callback, timing) { 
		this.interval = timing;
		this.callback = callback;
		this.stopped = false;
	}

	runLoop(thisArg) { 
		if (this.stopped) return;

		var context = thisArg ? thisArg : this.engine;
		var result = this.callback.call(context);

		if (typeof result == 'number') { 
			if (result === 0) return; // <-- return 0 in order to not loop
			this.interval = result;
		}

		this.loop();
	}

	stop() { 
		this.stopped = false;
		window.clearTimeout(this.timeout);
	}

	start() { 
		this.stopped = false;
		return this.loop();
	}

	loop() { 
		this.timeout = window.setTimeout(this.runLoop.bind(this), this.interval);
		return this;
	}
}