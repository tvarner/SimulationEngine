/*
    Simulator entry point.
*/
import Engine from './simulation-controller/Engine';
import StateSpace from './simulation-model/StateSpace';
import View from './simulation-view/View';

let engine = new Engine();
let view = new View();
let stateSpace = null;
// let activeSimulationId = null;

// simulation
import exampleTraversalSimulation from './simulations/ExampleTraversalSimulation/ExampleTraversalSimulation';
import exampleKinematicsSimulation from './simulations/ExampleKinematicsSimulation/ExampleKinematicsSimulation';

export function runSimulationEngine() {
	// console.log("RUNNING SIMULATION ENGINE [IN SIMULATION ENGINE]")
	// start render loop
	view.startRenderLoop();
}

export function stopSimulationEngine() { 
	// console.log("STOPPING SIMULATION ENGINE [IN SIMULATION ENGINE]")
	// stop/pause render loop
	view.stopRenderLoop();

	// TODO:
	// save simulation model
}

export function exitSimulationEngine() {
	// console.log('EXITING SIMULATION ENGINE [IN SIMULATION ENGINE]')
	// TODO: is this needed??

	engine = null;
	view = null;
	// activeSimulationId = null;
}

export function initializeSimulation() {
	// console.log("INITIALIZING SIMULATION [IN SIMULATION ENGINE]")

	// initialize simulation model    
	stateSpace = new StateSpace();
	stateSpace.initialize(/* stateSpaceModel */); // pass a state space model here (optional)
	stateSpace.setView(view); // pass a view to the model for reference

	// initialize simulation controller. pass it a stateSpace, and simulation model
	engine.initializeModel(stateSpace, exampleKinematicsSimulation); // <-- can also initialize state space here
}

export function runSimulation() {
	// console.log("RUNNING SIMULATION [IN SIMULATION ENGINE]")

	// run simulation
	engine.runSimulation();
}

export function stopSimulation() {
	// console.log("STOPPING SIMULATION [IN SIMULATION ENGINE]")
	// stop simulation
	engine.stopSimulation();
}

export function clearSimulation() {
	// clear simulation
	// console.log("CLEARING SIMULATION [IN SIMULATION ENGINE]")

	// TODO
	// temporary
	engine.stopSimulation();
}

export function loadSimulation(/* simulationKey */) { 
	// console.log("LOADING SIMULATION [IN SIMULATION ENGINE]")
	// TODO
}

export function saveSimulation(/* stateSpace */) { 
	// console.log("SAVING SIMULATION [IN SIMULATION ENGINE]")
	// TODO
}

export function initializeSimulationGUI() {
	// console.log("INITIALIZING SIMULATION GUI [IN SIMULATION ENGINE]")
	engine.initializeControls(); // <-- for primary user view only
}

export function destroySimulationGUI() {
	// console.log("DESTROYING SIMULATION GUI [IN SIMULATION ENGINE]")
	engine.destroyControls();
}

export function setSimulationViewControls(/* controlsId */) { 
	// console.log("SETTING SIMULATION VIEW CONTROLS [IN SIMULATION ENGINE]")
	// TODO
}

export function setSceneElement(/* elemClassName */) { 
	// console.log("SETTING SCENE ELEMENT FOR SIMULATOR [IN SIMULATION ENGINE]")
	// TODO
}
