/*
	The StateSpace should serve as a modular root container
	for everything needed to describe a simulation in Simulation Engine.
	The StatSpace should be able to describe and manage all 
	active simulations during a user session. This includes internal simulations,
	of a [root] simulation. For instance, forward look-ahead policies performed by 
	simulation agents.
*/

/* module utilitiy dependencies are added in define array */

import * as _ from 'lodash';
import PriorityQueue from 'js-priority-queue';

// import * as THREE from 'three';
// import TraversalGraph from './world/TraversalGraph/TraversalGraph';

export default class StateSpace { 
	constructor() {}

	initialize() { 
		// console.log("initialize() <-- state space");

		/* event sortation/comparison logic goes here */
		this.eventQueue = new PriorityQueue({
			comparator: function(eventA, eventB) {
				return eventB.executionTime - eventA.executionTime;
			}
		});

		// System model intialization

		// ******* Implement action callback, what we want on each time step
		// START HERE

		this.initializeModel();
	}

	initializeModel(/* model */) {
		this._initializeBoundedEvents();
		this._initializeConditionalEvents();
		this.eventCount = 0;
		this.eventLog;
		this.systemTime = 0;

		this.message = "initialized";
		this.traversalGraph;
	}

	updateStateSpace(t, data) {
		// DES: apply atomic operations to simulation state space here

		// Phase A & B: Check bounded events, and set next events
		this._checkBoundedEvents();

		// Phase C: check all default conditional events
		this._checkConditionalEvents();

/* Internal simulation models updates [START]: */

		// update mobile agents
		this.traversalGraph.updateStateSpace(t, data); // <-- delta in ms

/* Internal simulation models updates [END]: */

		// update system time for next iteration
		this.systemTime += t;
		this.systemTime = parseFloat(this.systemTime.toFixed(2)); // to correct for floating point addition errors
	}

	_initializeBoundedEvents() { 
		// initial bounded events go here
		this.boundedEvents = [];
	}

	_initializeConditionalEvents() { 
		// initial conditional events go here
		this.conditionalEvents = [];
	}

	_checkBoundedEvents() {
		const _boundedCheckFn = function(event) {
			if (event.completionCheck !== undefined) { 
				if (event.completionCheck()) { 
					event.run();
					this.eventCount++;
					return true;
				} else {
					return false;
				}
			}
		};
		_.remove(this.boundedEvents, _boundedCheckFn.bind(this));
	}

	_checkConditionalEvents() {
		if (this.conditionalEvents) {
			const _conditionalCheckFn = function(event) { 
				if (event.executionCondition !== undefined) {
					if (event.executionCondition()) { 
						event.run();
						this.eventCount++;
					}
				} else {
					// console.log(event);
					throw new Error("Event is not a conditional event");
				}
			};
			_.each(this.conditionalEvents, _conditionalCheckFn.bind(this));
		} else if (!this.boundedEvents) {
			// throw new Error("Simulation cannot run without conditional and bounded events");
		}
	}

	setView(view) { 
		this.view = view;
	}

	capture() {
		// console.log("capture() <-- state space");
		// console.log(this.systemTime);
		// console.log(this.message);
	}
}