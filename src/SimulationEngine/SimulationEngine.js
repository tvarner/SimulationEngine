/*
    Simulator entry point.
*/
import Engine from './simulation-controller/Engine';
import View from './simulation-view/View';

// simulations
import ExampleTraversalSimulation from './simulations/ExampleTraversalSimulation/ExampleTraversalSimulation';
import ExampleKinematicsSimulation from './simulations/ExampleKinematicsSimulation/ExampleKinematicsSimulation';

class SimulationEngine { 
	constructor() {
		// create new engine
		this.engine = new Engine();
		this.activeSimulation = undefined;
		this.simulationEngineInitialized = false;
		this.cleared = true;
	}

	initializeSimulationEngine() {
		// if Simulation Engine is already initialized, it must be closed (via closeSimulationeEngine())
		// before it can be reinitialized. This is so Simulation Engine can preserve its state when a user 
		// navigates away from the Simulator View.
		if (!this.simulationEngineInitialized) {
			// create new view
			this.view = new View();

			this.simulationEngineInitialized = true;
		}
	}

	playSimulationEngine() {
		if (this.simulationEngineInitialized) { 
			// start the render loop
			this.view.startRenderLoop();
		} else {
			console.warn('Simulation Engine must be initialized before playing Simulation Engine');
		}
	}

	pauseSimulationEngine() { 
		// pause active simulation if there is an active simulation
		if (this.simulationEngineInitialized) { 
			if (this.activeSimulation) { 
				this.pauseSimulation(); 
			}

			// stop render loop
			if (this.view) { 
				this.view.stopRenderLoop(); 
			}
		} else {
			console.warn('Simulation Engine must be initialized before pausing Simulation Engine');
		}
	}

	// This may be delegated to garbage collection...
	closeSimulationEngine() { 
		if (this.simulationEngineInitialized) { 
			// clear active simulation if it exists
			if (this.activeSimulation) { this.clearSimulation(false); }

			// stop render loop (pause simulation engine)
			this.pauseSimulationEngine();

			// clear references to view and engine
			this.view = undefined;
			this.engine = undefined;
		} else { 
			console.warn('Simulation Engine must be initialized before closing Simulation Engine');
		}
	}

	setSimulationEngineUserControls() { 
		//TODO 
	}





	// TODO refactor so that initialize simulation calls setActiveSimulation 
	// with simulationId arg






	setActiveSimulation(simulationId) { 
		// set active simulation based on simulation id

		// set active simulation (temporary)
		if (simulationId === 'Example Traversal Simulation') {
			this.activeSimulation = new ExampleTraversalSimulation();
		} else if (simulationId === 'Example Kinematics Simulation') { 
			this.activeSimulation = new ExampleKinematicsSimulation();
		}
	}

	initializeSimulation() {
		if (this.simulationEngineInitialized) {
			if (this.activeSimulation && this.cleared) {
				this.engine.initializeSimulation(this.activeSimulation, this.view);
				this.cleared = false;
			} else { 
				console.warn('Simulation Engine must have an active simulation before initializing simulation')
			}
		} else { 
			console.warn('Simulation Engine must be initialized before initializing simulation');
		}
	}





	// TODO: add play/pause finite states





	playSimulation() {
		if (this.simulationEngineInitialized) {
			if (this.activeSimulation) {
				this.engine.playSimulation();
			} else { 
				console.warn('Simulation Engine must have an active simulation before playing simulation')
			}
		} else { 
			console.warn('Simulation Engine must be initialized before playing simulation');
		}
	}

	pauseSimulation() {
		if (this.simulationEngineInitialized) {
			if (this.activeSimulation) {
				this.engine.pauseSimulation();
			} else { 
				console.warn('Simulation Engine must have an active simulation before pausing simulation')
			}
		} else { 
			console.warn('Simulation Engine must be initialized before pausing simulation');
		}
	}

// FIX Clear simulation bug

	clearSimulation(reinitializeScene) {
		if (this.simulationEngineInitialized) {
			if (this.activeSimulation && !this.cleared) {
				this.engine.clearSimulation(reinitializeScene);
				this.activeSimulation = undefined;
				this.cleared = true;
			} else { 
				console.warn('Simulation Engine must have an active simulation before clearing simulation')
			}
		} else { 
			console.warn('Simulation Engine must be initialized before clearing simulation');
		}
	}

	initializeSimulationGUI() {
		if (this.simulationEngineInitialized) {
			if (this.activeSimulation) {
				this.engine.initializeControls(); // <-- for primary user view only
			} else { 
				console.warn('Simulation Engine must have an active simulation before initializing simulation GUI')
			}
		} else { 
			console.warn('Simulation Engine must be initialized before initializing simulation GUI');
		}
	}

	destroySimulationGUI() {
		if (this.simulationEngineInitialized) {
			if (this.activeSimulation) {
				this.engine.destroyControls();
			} else { 
				console.warn('Simulation Engine must have an active simulation before destroying simulation GUI')
			}
		} else { 
			console.warn('Simulation Engine must be initialized before destroying simulation GUI');
		}
	}
}

export default new SimulationEngine();