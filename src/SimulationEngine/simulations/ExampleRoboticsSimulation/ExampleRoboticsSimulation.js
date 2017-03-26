// general utils
// import THREE from 'three';

// world config models
import TimeModel from '../../simulation-model/world/world_config_models/TimeModel';
import LengthModel from '../../simulation-model/world/world_config_models/LengthModel';
import ColorModel from '../../simulation-model/world/world_config_models/ColorModel';
// import ConfigParams from '../../simulation-model/world/world_config_models/ConfigParams';

// view utils
import dat from '../../utils/dat/index';

// simulation deps
import kineval from './../../simulation-model/world/kineval/kineval';
	// simulation robot
import robot from './../../simulation-model/world/kineval/models/robots/fetch/fetch.urdf';
	// simulation world
import world from './../../simulation-model/world/kineval/models/worlds/world_basic';

const ExampleRoboticsSimulation = function() { 
	this.name = 'Example Robotics Simulation';
	this.colorModel = ColorModel;
	this.lengthModel = new LengthModel();
	this.timeModel = new TimeModel();
	this.defaultSystemTimeLimit = 60; // <-- in seconds
	this.options = {};
	this.sceneLoaded = false;
	this.updateStateSpaceInRenderLoop = true;
};

ExampleRoboticsSimulation.prototype = { 
	initializeModel: function(stateSpace) {
		// initiate model
		stateSpace.systemTime = 0.0;

		// TODO: initialize this at a higher level
			// doing this right now, b/c I need to init controls in kineval after async scene loaded
		stateSpace.view.gui = new dat.gui.GUI();

		kineval.start(stateSpace.view, robot, world, this.options); // calls kineval.init();
		kineval.startingPlaceholderInit();  // a quick and dirty JavaScript tutorial
		kineval.robot.view.addRenderCallback('kineval_robot_control_loop', this.robotControlLoop);
	},








// TODO: redo initialization logic to get working







	initializeControls: function(stateSpace) {

		// robot interaction will not be initiated the first time this is called
		// b/c the gui is initialized in initializeModel.
		// interaction will only be initialized in this function if the gui was 
		// previously destroyed. An additional check is done in kineval.initInteraction()
		// if the scene has already been loaded, which permits initialization of interaction
		if (!stateSpace.view.gui) {
			stateSpace.view.gui = new dat.gui.GUI();
			kineval.initInteraction(this.options);
		}
	},

	updateControls: function(/* stateSpace */) {
		// CONTROLS UPDATE NOT NEEDED FOR THIS SIMULATION
			// UPDATED IN STATESPACE
	},

	updateStateSpace: function(/* t, stateSpace */) {

	},

	robotControlLoop() { 
		if (kineval.robot.sceneLoaded) { 
			// from my_animate():
			// set to starting point mode is true as default (initialized in kineval.js)
			// set to false once starting forward kinematics project
			// kineval.params.just_starting = false;
			if (kineval.robot.params.just_starting === true) {
					kineval.startingPlaceholderAnimate();
					kineval.robotDraw();
					return;
			}

			// ROBOT DYNAMICS 

			// update robot configuration from applied robot controls 
			//   (assuming pure kinematics for now)
			kineval.applyControls();

			// HANDLE USER CONTROLS

			// handle user input 
			kineval.handleUserInput();

			// perform forward kinematics placing robot links in space wrt configuration
			kineval.robotForwardKinematics();

			// determine if robot is currently in collision with world
			kineval.robotIsCollision();

			// render robot and world in 3D scene
			kineval.robotDraw();

			kineval.applySetpointControls();

			// if requested, perform inverse kinematics control to reach to point
			kineval.robotInverseKinematics();

			// if requested, perform configuration space motion planning to home pose
			kineval.planMotionRRTConnect();
		}
	}
};

export default ExampleRoboticsSimulation;