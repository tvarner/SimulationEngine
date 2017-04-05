// TODO create Simulation Object here
// reference deps to Engine and State Space and TraversalGraph

// general utils
import * as _ from 'lodash';
// import * as THREE from 'three';

// world config models
import TimeModel from '../../simulation-model/world/world_config_models/TimeModel';
import LengthModel from '../../simulation-model/world/world_config_models/LengthModel';
import ColorModel from '../../simulation-model/world/world_config_models/ColorModel';
// import ConfigParams from '../../simulation-model/world/world_config_models/ConfigParams';

// view utils
import dat from '../../utils/dat/index';

// from StateSpace
import TraversalGraph from '../../simulation-model/world/TraversalGraph/TraversalGraph';
import RandomExamplePathModel from './RandomExamplePathModel';

const ExampleTraversalSimulation = function() { 
	this.name = "Example Simulation 1";
	this.colorModel = ColorModel;
	this.lengthModel = new LengthModel();
	this.timeModel = new TimeModel();
	this.defaultSystemTimeLimit = 60; // <-- in seconds
};


ExampleTraversalSimulation.prototype = { 
	initializeModel: function(stateSpace) {
		// TODO: LOAD/BUILD MODELS SYNCHRONOUSLY!!!!! pg.48 Threejs cookbook
		// Add optimization in general from books

		// initiate model
		stateSpace.systemTime = 0.0;  

			// add initial model objects
		this.traversalGraph = new TraversalGraph(new RandomExamplePathModel());
		stateSpace.view.scene.add(this.traversalGraph.body);

		this.traversalGraph.addMobileAgent("MobileAgent 0", "lane 0");
		this.traversalGraph.addMobileAgent("MobileAgent 1", "lane 1");
		this.traversalGraph.addMobileAgent("MobileAgent 2", "lane 2");
		this.traversalGraph.addMobileAgent("MobileAgent 3", "lane 3");
		this.traversalGraph.addMobileAgent("MobileAgent 4", "lane 4");
		this.traversalGraph.addMobileAgent("MobileAgent 5", "lane 5");

		// customize each mobile agent
		_.each(this.traversalGraph.mobileAgents, (mobileAgent) => { 
			if (mobileAgent.lane.id === "lane 0") { 
				mobileAgent.previousLane = this.traversalGraph.getLane("lane 1");
			} else if (mobileAgent.lane.id === "lane 1") { 
				mobileAgent.previousLane = this.traversalGraph.getLane("lane 0");
			} else if (mobileAgent.lane.id === "lane 2") { 
				mobileAgent.previousLane = this.traversalGraph.getLane("lane 1");
			}

			if (mobileAgent.lane.id === "lane 3") { 
				mobileAgent.previousLane = this.traversalGraph.getLane("lane 4");
			} else if (mobileAgent.lane.id === "lane 4") { 
				mobileAgent.previousLane = this.traversalGraph.getLane("lane 3");
			} else if (mobileAgent.lane.id === "lane 5") { 
				mobileAgent.previousLane = this.traversalGraph.getLane("lane 4");
			}
		});
	},

	initializeControls: function(stateSpace) {
		const _agentUpdateInterval = this.timeModel.AGENT_UPDATE_INTERVAL;
		const mobileAgents = this.traversalGraph.mobileAgents;
		const lattice1 = this.traversalGraph.getCluster("lattice1");
		const lattice2 = this.traversalGraph.getCluster("lattice2");

		// initialize controls and control values
		stateSpace.view.controls = new function() {
			// agent update interval control
			this.AGENT_UPDATE_INTERVAL = _agentUpdateInterval;

			// mobileAgent velocity, reverse controls
			_.each(mobileAgents, (mobileAgent, i) => {
				const agentVelocityControl = 'AGENT_' + i.toString() + '_VELOCITY';

				this[agentVelocityControl] = 5.0;

				const agentReverseControl = 'AGENT_' + i.toString() + '_REVERSE';

				this[agentReverseControl] = mobileAgent.reverseDirection.bind(mobileAgent);
			});

			// lattice1 position controls
			this.LATTICE1_xPos = lattice1.body.position.x;
			this.LATTICE1_yPos = lattice1.body.position.y;
			this.LATTICE1_zPos = lattice1.body.position.z;

			// lattice1 position controls
			this.LATTICE2_xPos = lattice2.body.position.x;
			this.LATTICE2_yPos = lattice2.body.position.y;
			this.LATTICE2_zPos = lattice2.body.position.z;
		};

		// add gui to state space
		stateSpace.view.gui = new dat.gui.GUI();

		// add folders
		const stateSpaceFolder = stateSpace.view.gui.addFolder('State Space');
		const controlsFolder = stateSpace.view.gui.addFolder('Simulation Controls');

		// add save functionality for controls presets
		stateSpace.view.gui.remember(stateSpace.view.controls);

		// add state space variables to the GUI for display [for each agent]
		stateSpaceFolder.add(stateSpace.view.controls, 'AGENT_UPDATE_INTERVAL', 4 , 200 ).listen();
		_.each(mobileAgents, (mobileAgent, i) => {
			const agentVelocityControl = 'AGENT_' + i.toString() + '_VELOCITY';
			stateSpaceFolder.add(stateSpace.view.controls, agentVelocityControl, this.traversalGraph.getMobileAgent(mobileAgent.id).MIN_VELOCITY, this.traversalGraph.getMobileAgent(mobileAgent.id).MAX_VELOCITY).listen();
		});

		// add controls to the GUI, within minimum and maximum values [for each agent]
		controlsFolder.add(stateSpace.view.controls, 'AGENT_UPDATE_INTERVAL', 4 , 200 );
		_.each(mobileAgents, (mobileAgent, i) => {
			const agentVelocityControl = 'AGENT_' + i.toString() + '_VELOCITY';
			const agentReverseControl = 'AGENT_' + i.toString() + '_REVERSE';
			controlsFolder.add(stateSpace.view.controls, agentVelocityControl, this.traversalGraph.getMobileAgent(mobileAgent.id).MIN_VELOCITY, this.traversalGraph.getMobileAgent(mobileAgent.id).MAX_VELOCITY);
			controlsFolder.add(stateSpace.view.controls, agentReverseControl);
		});

		controlsFolder.add(stateSpace.view.controls, 'LATTICE1_xPos', 0 , 150 );
		controlsFolder.add(stateSpace.view.controls, 'LATTICE1_yPos', 0 , 150 );
		controlsFolder.add(stateSpace.view.controls, 'LATTICE1_zPos', 0 , 150 );
		controlsFolder.add(stateSpace.view.controls, 'LATTICE2_xPos', 0 , 150 );
		controlsFolder.add(stateSpace.view.controls, 'LATTICE2_yPos', 0 , 150 );
		controlsFolder.add(stateSpace.view.controls, 'LATTICE2_zPos', 0 , 150 );
	},

	updateStateSpace: function(t, stateSpace) {
		// edit math on t (delta t) to control the system time increment per time step.
		// t = 0.1 --> 0.1 [system] seconds

		// DES: apply atomic operations to simulation state space here

		// Phase A & B: Check bounded events, and set next events
		stateSpace._checkBoundedEvents();

		// Phase C: check all default conditional events
		stateSpace._checkConditionalEvents();

/* Internal simulation models updates [START]: */

		// update mobile agents
		this.traversalGraph.updateStateSpace(t); // <-- delta in ms

/* Internal simulation models updates [END]: */

		// update system time for next iteration
		stateSpace.systemTime += t;
		stateSpace.systemTime = parseFloat(stateSpace.systemTime.toFixed(2)); // to correct for floating point addition errors
	},

	updateControls: function(stateSpace) { 
		if (stateSpace.view.gui && stateSpace.view.controls) { 
			// update agent update interval        
			this.timeModel.AGENT_UPDATE_INTERVAL = stateSpace.view.controls.AGENT_UPDATE_INTERVAL;
			
			// update agents
			_.each(this.traversalGraph.mobileAgents, (agent, i) => {
				const agentVelocityControl = 'AGENT_' + i.toString() + '_VELOCITY';

				agent.v = stateSpace.view.controls[agentVelocityControl];
			});

			// update lattice positions
			const lattice1 = this.traversalGraph.getCluster("lattice1");
			const lattice2 = this.traversalGraph.getCluster("lattice2");

			lattice1.body.position.x = stateSpace.view.controls.LATTICE1_xPos;
			lattice1.body.position.y = stateSpace.view.controls.LATTICE1_yPos;
			lattice1.body.position.z = stateSpace.view.controls.LATTICE1_zPos;

			lattice2.body.position.x = stateSpace.view.controls.LATTICE2_xPos;
			lattice2.body.position.y = stateSpace.view.controls.LATTICE2_yPos;
			lattice2.body.position.z = stateSpace.view.controls.LATTICE2_zPos;
		}
	}
};

export default ExampleTraversalSimulation;