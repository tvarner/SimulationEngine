import THREEx from './../../../simulation-view/utils/threex.keyboardstate';
import * as THREE from 'three';
import _m from './utils/matrixMath';

/**
*
	Import points of invocation of core robot functions.

	Ultimately, kineval should be a program that communicates to other [sub]programs
	that execute core robot functions. kineval can receive the programs in
	two ways: 1. via imported modules written in javascript (or transpiled to javascript),
	or 2. via WebSockets over a network connection that takes input as 
	JSON and produces output asynchronously as JSON.

		transpilers include: 
		1. Transcrypt - for Python modules (www.transcrypt.org)
		2. ScalaJS - for Scala (www.scala-js.org)
		3. JSweet - for Java (www.jsweet.org/)
		3. Emscripten - for LLVM (www.emscripten.org)

	This allows robot designers to use any combination of languages they choose 
	to build the robot control loop (i.e. for sensing, planning, and acting), while having
	visualization capabilities in the browser.

	kineval wraps the invidual modules into a complete robot motion and control stack, suitable 
	for the browser that also serves as a human robot interface.

	for simulated robots, kineval takes in a robot model (URDF), displays its current state, and updates that state
	using kinematics/dynamics and control. 

	kineval sends commands in the form of ros topics to real robots, and uses the 
	robot URDF to display the robot's transformation and sensor input to display the 
	robot's vision (i.e. in the form of 3D point clouds).
*/
import {buildFKTransforms} from './kinematics/fk_solver';
import {
	iterateIK,
	randomizeIKtrial,
} from './kinematics/ik_solver';
import {computeMotionPlan} from './motion_planning/motion_planner';
import {testCollision} from './motion_planning/collision_detector';
import {robotApplyControls} from './controls/controls';
import {
	setPoseSetpoint,
	assignPoseSetpoint,
	executeClock, 
	executeSetpoints,
	robotPdControl
} from './controls/servo_control';

/*-- |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/|

	KinEval | Kinematic Evaluator | core functions

	Implementation of robot kinematics, control, decision making, and dynamics 
		in HTML5/JavaScript and threejs
	 
	@author ohseejay / https://github.com/ohseejay / https://bitbucket.org/ohseejay

	Chad Jenkins
	Laboratory for Perception RObotics and Grounded REasoning Systems
	University of Michigan

	License: Creative Commons 3.0 BY-SA

|\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| --*/

// TODO:
// 1. import all files into here to build kineval
// 2. add all global functions and variables to kineval
// 3. handle remaining dependencies
// 4. lint all modules
// 5. export kineval
// --> implement initialization file in index.html

// ////////////////////////////////////////////////
// ///     KINEVAL OBJECT CONSTRUCTION AND START
// ////////////////////////////////////////////////

// create the kineval object/namespace
export default{
	start: function kinevalExecute(view, robot, world, eventoptions) {
		// KinEval uses init() to initialize threejs scene, user input, and robot kinematics
		// STUDENT: you should use my_init() instead
		this.init(view, robot, world, eventoptions);

		// KinEval uses animate() as the main animation loop maintained by threejs 
		// STUDENT: you should use my_animate() instead
		// this.animate();

			// --> moved inside init method
	},

	init: function init(view, robot, world, options) {
debugger;
		// add imported robot and world to kineval
		this.robot = robot;
		this.robot.world = world;

		// initialize robot kinematics
			// fetch robot resources from remote server if applicable
		this.initRobot();  

		// create kineval params object and set initial values
		this.initRobotParameters(options);

		/**
		*
		* Link browser view (scene, camera, cameraControls) and robot view.
		*
		*/
		this.robot.view = view;

		// robot resoureces fetched 
		if (this.robot.links_geom_imported) {
			this.robot.eventEmitter.on('collada_loaded', () => {
				// initialize threejs and rendering scene
				console.info("Robot collada loaded!");

				this.initScene();

				// initialize interface parameters and interaction interfaces
				this.initInteraction(options);

				// initialize rosbridge connection to robot running ROS, if available
				// KE 2 : uncomment and add toggle 
				// this.initrosbridge();

				// call user's initialization
				// my_init();

				// this.animate();
				this.robot.eventEmitter.emit('async_scene_loaded');
			});
			this.robot.retrieveCollada();
		} else {
			// initialize threejs and rendering scene
			this.initScene();

			// initialize interface parameters and interaction interfaces
			this.initInteraction(options);

			// initialize rosbridge connection to robot running ROS, if available
			// KE 2 : uncomment and add toggle 
			// this.initrosbridge();

			// call user's initialization
			// my_init();

			// this.animate();
		}
	},

	robotDraw: function drawRobot() {
		// robot links
		for (const x in this.robot.links) {
			// KE : properly scope global variable this.robot_material
			if (this.robot.params.display_wireframe) {
				this.robot_material.wireframe = true;
			} else {
				this.robot_material.wireframe = false;
			}

			// toggled robot link display
			if (this.robot.params.display_links) {
				const tempmat = _m.matrix_2Darray_to_threejs(this.robot.links[x].xform);
				_m.simpleApplyMatrix(this.robot.links[x].geom,tempmat);
				this.robot.links[x].geom.visible = true;
			} else {
				this.robot.links[x].geom.visible = false;
			}

			// toggled robot link axes display
			if (this.robot.params.display_links_axes) {
				this.robot.links[x].axis_geom_x.visible = true;
				this.robot.links[x].axis_geom_y.visible = true;
				this.robot.links[x].axis_geom_z.visible = true;
			}
			else {
				this.robot.links[x].axis_geom_x.visible = false;
				this.robot.links[x].axis_geom_y.visible = false;
				this.robot.links[x].axis_geom_z.visible = false;
			}

			// toggled robot link collision bounding box display
			if (this.robot.params.display_collision_bboxes)
				this.robot.links[x].bbox_mesh.visible = true;
			else
				this.robot.links[x].bbox_mesh.visible = false;
		}

		// display bounding box for robot link in collision
		if (this.robot.collision)
			this.robot.links[this.robot.collision].bbox_mesh.visible = true;

		// toggled display of robot base axes 
		if (this.robot.params.display_base_axes) {
			this.robot.links[this.robot.base].axis_geom_x.visible = true;
			this.robot.links[this.robot.base].axis_geom_y.visible = true;
			this.robot.links[this.robot.base].axis_geom_z.visible = true;
		}

		// robot joints
		for (const x in this.robot.joints) {
			// toggled robot joint display
			if (this.robot.params.display_joints) {
				const tempmat = _m.matrix_2Darray_to_threejs(this.robot.joints[x].xform);
				_m.simpleApplyMatrix(this.robot.joints[x].geom,tempmat);
				this.robot.joints[x].geom.visible = true;
			}
			else
				this.robot.joints[x].geom.visible = false;

			// toggled robot joint axes display
			if (this.robot.params.display_joints_axes) {
				this.robot.joints[x].axis_geom_x.visible = true;
				this.robot.joints[x].axis_geom_y.visible = true;
				this.robot.joints[x].axis_geom_z.visible = true;
			}
			else {
				this.robot.joints[x].axis_geom_x.visible = false;
				this.robot.joints[x].axis_geom_y.visible = false;
				this.robot.joints[x].axis_geom_z.visible = false;
			}
		}
		
		// toggled display of joint with active control focus
		if (this.robot.params.display_joints_active) {
			const x = this.robot.params.active_joint;
			const tempmat = _m.matrix_2Darray_to_threejs(this.robot.joints[x].xform);
			_m.simpleApplyMatrix(this.robot.joints[x].geom,tempmat);
			this.robot.joints[x].geom.visible = true;
			if (this.robot.params.display_joints_active_axes) {
				this.robot.joints[x].axis_geom_x.visible = true;
				this.robot.joints[x].axis_geom_y.visible = true;
				this.robot.joints[x].axis_geom_z.visible = true;
			}
		}

		if (typeof _m.matrix_multiply !== 'undefined') { // hacked for stencil
			// display robot endeffector
			let endeffector_mat = [];
			if (this.robot.params.ik_orientation_included) {
				endeffector_mat = _m.matrix_2Darray_to_threejs(_m.matrix_multiply(this.robot.joints[this.robot.endeffector.frame].xform,_m.generate_translation_matrix(this.robot.endeffector.position[0][0],this.robot.endeffector.position[1][0],this.robot.endeffector.position[2][0])));
			} else {
				this.robot.endeffector_world = _m.matrix_multiply(this.robot.joints[this.robot.endeffector.frame].xform,this.robot.endeffector.position);
				endeffector_mat = _m.matrix_2Darray_to_threejs(_m.generate_translation_matrix(this.robot.endeffector_world[0][0],this.robot.endeffector_world[1][0],this.robot.endeffector_world[2][0]));
			}
			_m.simpleApplyMatrix(this.robot.endeffector_geom, endeffector_mat);

			// display endeffector target
			if (this.robot.params.ik_orientation_included) {
				this.target_mat = _m.matrix_2Darray_to_threejs(
					_m.matrix_multiply(
						_m.generate_translation_matrix(this.robot.params.ik_target.position[0][0],this.robot.params.ik_target.position[1][0],this.robot.params.ik_target.position[2][0]),
						_m.matrix_multiply(
							_m.generate_rotation_matrix_X(this.robot.params.ik_target.orientation[0]),
							_m.matrix_multiply(
								_m.generate_rotation_matrix_Y(this.robot.params.ik_target.orientation[1]),
								_m.generate_rotation_matrix_Z(this.robot.params.ik_target.orientation[2])
				))));
			} else {
				this.target_mat = _m.matrix_2Darray_to_threejs(_m.generate_translation_matrix(this.robot.params.ik_target.position[0][0],this.robot.params.ik_target.position[1][0],this.robot.params.ik_target.position[2][0]));
			}
			_m.simpleApplyMatrix(this.target_geom, this.target_mat);
			// hacked for stencil

			if ((this.robot.params.update_ik)||(this.robot.params.persist_ik)) { 
				this.robot.endeffector_geom.visible = true;
				this.target_geom.visible = true;
			} else {
				this.robot.endeffector_geom.visible = false;
				this.target_geom.visible = false;
			}
		}
	},

	initInteraction: function initInteraction(options) {
		// instantiate threejs keyboard controls, for interactive controls
		this.keyboard = new THREEx.KeyboardState();

		// create events and handlers for interaction controls
		this.initKeyEvents();


		// create GUI display object and configure
		this.initGUIDisplay(options);
	},

	initRobotParameters: function initRobotParameters(options) {
		// create params object 
		this.robot.params = {};

		this.robot.params.just_starting = false;  // set to true as default, set false once starting forward kinematics project

		// sets request for single update or persistent update of robot pose based on IK, setpoint controller, etc. 
		this.robot.params.update_pd = false;
		this.robot.params.persist_pd = false;
		this.robot.params.update_pd_clock = false;      
		this.robot.params.update_pd_dance = false;      
		this.robot.params.update_ik = false;      
		this.robot.params.persist_ik = false;      
		this.robot.params.trial_ik_random = {};
		this.robot.params.trial_ik_random.execute = false;
		this.robot.params.trial_ik_random.start = 0;
		this.robot.params.trial_ik_random.time = 0.00001;
		this.robot.params.trial_ik_random.targets = 0;
		this.robot.params.trial_ik_random.distance_current = 0.00001;

		// initialize the active joint for user control
		this.robot.params.active_link = this.robot.base;

		if (typeof this.robot.links[this.robot.params.active_link].children === 'undefined') {
			this.robot.params.active_joint = Object.keys(this.robot.joints)[0];
		} else {
			this.robot.params.active_joint = this.robot.links[this.robot.params.active_link].children[0];
		}

		// initialize pose setpoints and target setpoint
		this.robot.setpoints = [];
		this.robot.params.setpoint_target = {};
		for (let i=0;i<10;i++) {  // 10 is the number of slots for pose setpoints
			this.robot.setpoints[i] = {};
			for (const x in this.robot.joints) {
				this.robot.params.setpoint_target[x] = 0;  // current setpoint target
				this.robot.setpoints[i][x] = 0;  // slot i setpoint
			}
		}

		this.robot.params.dance_pose_index = 0;
		this.robot.params.dance_sequence_index = [0,1,2,3,4,5,6,7,8,9];
		if (this.robot.name === 'fetch') {  // fetch easter egg
			this.robot.params.dance_sequence_index = [1,2,1,2,1,0,3,0,3,0];
			this.robot.setpoints = 
				[{"torso_lift_joint":0,"shoulder_pan_joint":0,"shoulder_lift_joint":0,"upperarm_roll_joint":0,"elbow_flex_joint":0,"forearm_roll_joint":0,"wrist_flex_joint":0,"wrist_roll_joint":0,"gripper_axis":0,"head_pan_joint":0,"head_tilt_joint":0,"torso_fixed_joint":0},{"torso_lift_joint":0.4,"shoulder_pan_joint":1.6056,"shoulder_lift_joint":-0.7112110832854187,"upperarm_roll_joint":-0.5224344562407175,"elbow_flex_joint":-0.2596467353995974,"forearm_roll_joint":0.027744058428229964,"wrist_flex_joint":-0.011999677661943124,"wrist_roll_joint":0.00012972717196553372,"gripper_axis":0.0001297271719655264,"head_pan_joint":0.00005720356139027753,"head_tilt_joint":0.00005283131465981046,"torso_fixed_joint":0.00012972717196555266},{"torso_lift_joint":0.4,"shoulder_pan_joint":0.34460326176810346,"shoulder_lift_joint":0.9958007666048422,"upperarm_roll_joint":-1.3788601366395654,"elbow_flex_joint":0.8938364230947411,"forearm_roll_joint":-0.10797832064349865,"wrist_flex_joint":0.6820807432085109,"wrist_roll_joint":0.0001297271719655064,"gripper_axis":0.00012972717196552277,"head_pan_joint":0.00005720356139027753,"head_tilt_joint":0.00005283131465981046,"torso_fixed_joint":0.00012972717196555266},{"torso_lift_joint":0.4,"shoulder_pan_joint":0.0004677854383942246,"shoulder_lift_joint":-1.221,"upperarm_roll_joint":-0.00037940857494373875,"elbow_flex_joint":0.00024155542149740568,"forearm_roll_joint":0.00001232914385335755,"wrist_flex_joint":0.00040145426866142973,"wrist_roll_joint":4.319780384106989e-8,"gripper_axis":4.319780384107232e-8,"head_pan_joint":1.904819311566239e-8,"head_tilt_joint":1.759228026605762e-8,"torso_fixed_joint":4.319780384108353e-8},{"torso_lift_joint":0,"shoulder_pan_joint":0,"shoulder_lift_joint":0,"upperarm_roll_joint":0,"elbow_flex_joint":0,"forearm_roll_joint":0,"wrist_flex_joint":0,"wrist_roll_joint":0,"gripper_axis":0,"head_pan_joint":0,"head_tilt_joint":0,"torso_fixed_joint":0},{"torso_lift_joint":0,"shoulder_pan_joint":0,"shoulder_lift_joint":0,"upperarm_roll_joint":0,"elbow_flex_joint":0,"forearm_roll_joint":0,"wrist_flex_joint":0,"wrist_roll_joint":0,"gripper_axis":0,"head_pan_joint":0,"head_tilt_joint":0,"torso_fixed_joint":0},{"torso_lift_joint":0,"shoulder_pan_joint":0,"shoulder_lift_joint":0,"upperarm_roll_joint":0,"elbow_flex_joint":0,"forearm_roll_joint":0,"wrist_flex_joint":0,"wrist_roll_joint":0,"gripper_axis":0,"head_pan_joint":0,"head_tilt_joint":0,"torso_fixed_joint":0},{"torso_lift_joint":0,"shoulder_pan_joint":0,"shoulder_lift_joint":0,"upperarm_roll_joint":0,"elbow_flex_joint":0,"forearm_roll_joint":0,"wrist_flex_joint":0,"wrist_roll_joint":0,"gripper_axis":0,"head_pan_joint":0,"head_tilt_joint":0,"torso_fixed_joint":0},{"torso_lift_joint":0,"shoulder_pan_joint":0,"shoulder_lift_joint":0,"upperarm_roll_joint":0,"elbow_flex_joint":0,"forearm_roll_joint":0,"wrist_flex_joint":0,"wrist_roll_joint":0,"gripper_axis":0,"head_pan_joint":0,"head_tilt_joint":0,"torso_fixed_joint":0},{"torso_lift_joint":0,"shoulder_pan_joint":0,"shoulder_lift_joint":0,"upperarm_roll_joint":0,"elbow_flex_joint":0,"forearm_roll_joint":0,"wrist_flex_joint":0,"wrist_roll_joint":0,"gripper_axis":0,"head_pan_joint":0,"head_tilt_joint":0,"torso_fixed_joint":0}];
		}

		// initialize inverse kinematics target location 
		// KE 3 : ik_target param is redundant as an argument into inverseKinematics 
		this.robot.params.ik_target = {};
		this.robot.params.ik_target.position = [[0],[0.8],[1.0],[1]];
		this.robot.params.ik_target.orientation = [Math.PI/6, Math.PI/4, 0];
		this.robot.params.ik_orientation_included = false;
		this.robot.params.ik_steplength = 0.1;
		this.robot.params.ik_pseudoinverse = false;

		// initialize flags for executing planner
		this.robot.params.generating_motion_plan = false; // monitor specifying state of motion plan generation
		this.robot.params.update_motion_plan = false; // sets request to generate motion plan 
		this.robot.motion_plan = [];
		this.robot.motion_plan_traversal_index = 0;
		this.robot.params.update_motion_plan_traversal = false; // sets automatic traversal of previously generated motion plan
		this.robot.params.persist_motion_plan_traversal = false; // sets automatic traversal of previously generated motion plan
		this.robot.params.planner_state = "not invoked";

		// toggle display of robot links, joints, and axes 
		this.robot.params.display_links = true; 
		this.robot.params.display_links_axes = false; 
		this.robot.params.display_base_axes = false; 
		this.robot.params.display_joints = false; 
		this.robot.params.display_joints_axes = false; 
		this.robot.params.display_collision_bboxes = false;
		this.robot.params.display_wireframe = false;
		this.robot.params.display_joints_active = true; 
		this.robot.params.display_joints_active_axes = true; 

		// apply environment floor with map texture-mapped onto ground plane
		this.robot.params.map_filename = options.map_filename;
		if (typeof this.robot.params.map_filename === 'undefined') this.robot.params.display_map = false;
		else this.robot.params.display_map = true;
	},

	initScene: function initScene() {
		// instantiate threejs scene graph
		// scene = new THREE.Scene();

		// instantiate threejs camera and set its position in the world
		// camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );

		// KE 2 : make camera offset from robot vary with interaction, not constant 
		this.robot.view.camera.position.y = 1;
		this.robot.view.camera.position.z = 4;

		if (THREE === undefined) { 
			debugger;
		}

		const light1 = new THREE.PointLight( 0xffffff, 0.3, 1000 ); 
		light1.position.set( 50, 50, 50 ); 
		this.robot.view.scene.add( light1 );

		const light2 = new THREE.PointLight( 0xffffff, 0.3, 1000 ); 
		light2.position.set( 50, 50, -50 ); 
		this.robot.view.scene.add( light2 );

		const light3 = new THREE.PointLight( 0xffffff, 0.3, 1000 ); 
		light3.position.set( -50, 50, -50 ); 
		this.robot.view.scene.add( light3 );

		const light4 = new THREE.PointLight( 0xffffff, 0.3, 1000 ); 
		light4.position.set( -50, 50, 50 ); 
		this.robot.view.scene.add( light4 );

	/*
		// instantiate threejs renderer and its dimensions
		// THREE r62 renderer = new THREE.WebGLRenderer();
		//renderer = new THREE.WebGLRenderer({antialias: true});
		renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
		renderer.setClearColor(0x00234c,1); // blue
		renderer.setClearColor(0xffc90b,1); // maize
		renderer.setClearColor(0xffffff,1); // white
		renderer.setClearColor(0x888888,1); // gray
		renderer.setSize( window.innerWidth, window.innerHeight );

		// attach threejs renderer to DOM
		document.body.appendChild( renderer.domElement );


		// instantiate threejs camera controls
		camera_controls = new THREE.OrbitControls( camera );
		camera_controls.addEventListener( 'change', renderer );
	*/

		// create world floor
		// KE T creates error : "TypeError: n.x is undefined" 
		// THREE r62 var mapMaterial = new THREE.MeshBasicMaterial( { map: this.robot.params.map_texture, transparent: true, opacity: 0.2 } ); 
		const mapMaterial = new THREE.MeshBasicMaterial( { color: 0x00234c , transparent: true, opacity: 0.5 } ); 
		const mapGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
		this.robot.map = new THREE.Mesh(mapGeometry, mapMaterial);
		this.robot.map.doubleSided = true;
		//map.receiveShadow = true; // KE T: recheck to make sure this works
		this.robot.map.rotateOnAxis({x:1,y:0,z:0},-Math.PI/2),
		this.robot.view.scene.add(this.robot.map);

		// create grid on floor
		const gridHelper = new THREE.GridHelper( 50, 5 );
		gridHelper.translateOnAxis(new THREE.Vector3(0,1,0),0.02);
		gridHelper.setColors(0xffc90b,0x00234c);
		gridHelper.material.transparent = true;
		gridHelper.material.opacity = 0.2;
		this.robot.view.scene.add( gridHelper );

		// create geometry for endeffector and Cartesian target indicators
		let temp_geom = new THREE.CubeGeometry(0.3, 0.3, 0.3);
		let temp_material = new THREE.MeshBasicMaterial( {color: 0x0088ff} );
		
		this.robot.endeffector_geom = new THREE.Mesh(temp_geom, temp_material); // comment this for coolness    
		this.robot.endeffector_geom.visible = false;
		this.robot.view.scene.add(this.robot.endeffector_geom);

		temp_geom = new THREE.CubeGeometry(0.3, 0.3, 0.3);
		temp_material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
		this.target_geom = new THREE.Mesh(temp_geom, temp_material); // comment this for coolness
		this.target_geom.visible = false;
		this.robot.view.scene.add(this.target_geom);

		// create threejs geometries for robot links
		this.initRobotLinksGeoms();

		// create threejs geometries for robot joints
		this.initRobotJointsGeoms();

		// create threejs geometries for robot planning scene
		this.initWorldPlanningScene();

		// KE T: move this out
		//this.tempPointCloud(); 
		//this.tempGeometryLoading();
		this.robot.sceneLoaded = true;
	},

	initGUIDisplay: function(/* options */) {
		if (!this.robot.view.gui) {
			throw new Error('Must supply dat.GUI to robot before initializing interaction');
		}
		if (!this.robot.sceneLoaded) {
			throw new Error('Robot scene must be initialized via initScene() before initializing interaction');
		}

		// var gui = new dat.GUI();

		const dummy_display = {};
		dummy_display['kineval'] = function() {
			this.displayHelp;
		};
		this.robot.view.gui.add(dummy_display, 'kineval');

		this.robot.view.gui.add(this.robot.params, 'just_starting').listen();

		const gui_url = this.robot.view.gui.addFolder('User Parameters');
		gui_url.add(this.robot, 'name');
		gui_url.add(this.robot.world, 'name');
		// gui_url.add(options, 'map_filename');
		// gui_world = this.robot.view.gui.addFolder('World');

		const gui_robot = this.robot.view.gui.addFolder('Robot');
		gui_robot.add(this.robot, 'name');
		gui_robot.add(this.robot, 'base');
		gui_robot.add(this.robot.params, 'active_joint').listen();

		const gui_fk = this.robot.view.gui.addFolder('Forward Kinematics');
		gui_fk.add(this.robot.params, 'persist_pd').listen();
		gui_fk.add(this.robot.params, 'update_pd_clock').listen();
		gui_fk.add(this.robot.params, 'update_pd_dance').listen();
		// KE 2 : gui dat not configured for arrays
		// gui_fk.addFolder("Base Pose")
		// gui_fk.add(this.robot.origin.xyz, '[0]');
		for (const x in this.robot.joints) {
			let lower = 0;
			let upper = Math.PI * 2;
			if (this.robot.joints[x].limit !== undefined) {
				if (this.robot.joints[x].limit.lower !== undefined) { 
					lower = this.robot.joints[x].limit.lower;
				}
				if (this.robot.joints[x].limit.upper !== undefined) { 
					upper = this.robot.joints[x].limit.upper;
				}
			}
			gui_fk.addFolder(x).add(this.robot.joints[x], 'angle', lower, upper).listen();
		}

		const gui_ik = this.robot.view.gui.addFolder('Inverse Kinematics');
		gui_ik.add(this.robot.params, 'persist_ik').listen();
		gui_ik.add(this.robot.params, 'ik_steplength', 0, 1).listen();
		gui_ik.add(this.robot.params, 'ik_pseudoinverse').listen();
		gui_ik.add(this.robot.params, 'ik_orientation_included').listen();
		// KE 2 : gui dat not configured for arrays
		// gui_ik.add(this.robot.params.ik_target, '[0]').listen();

		const gui_trial = gui_ik.addFolder('IK Random Trial');
		gui_trial.add(this.robot.params.trial_ik_random, 'execute').listen();
		gui_trial.add(this.robot.params.trial_ik_random, 'time').listen();
		gui_trial.add(this.robot.params.trial_ik_random, 'targets').listen();
		gui_trial.add(this.robot.params.trial_ik_random, 'distance_current').listen();

		const gui_plan = this.robot.view.gui.addFolder('Motion Planning');
		const dummy_planning_object = {};

		dummy_planning_object.start_planner = function() {
			this.robot.params.update_motion_plan = true;
		}; // console.log("start planning")};

		gui_plan.add(dummy_planning_object, 'start_planner');
		gui_plan.add(this.robot.params, 'planner_state').listen();
		gui_plan.add(this.robot.params, 'persist_motion_plan_traversal');

		const gui_display = this.robot.view.gui.addFolder('Display');

		const gui_axes = gui_display.addFolder('Geometries and Axes');
		gui_axes.add(this.robot.params, 'display_links');
		gui_axes.add(this.robot.params, 'display_links_axes');
		gui_axes.add(this.robot.params, 'display_base_axes');
		gui_axes.add(this.robot.params, 'display_joints');
		gui_axes.add(this.robot.params, 'display_joints_axes');
		gui_axes.add(this.robot.params, 'display_joints_active');
		gui_axes.add(this.robot.params, 'display_joints_active_axes');
		gui_axes.add(this.robot.params, 'display_wireframe');
		gui_axes.add(this.robot.params, 'display_collision_bboxes');
		//gui_axes.add(this.robot.params, 'display_map');

		const gui_colors = gui_display.addFolder('Colors');

		const gui_ground_color = gui_colors.addFolder('Ground');
		gui_ground_color.add(this.robot.map.material.color, 'r',0,1);
		gui_ground_color.add(this.robot.map.material.color, 'g',0,1);
		gui_ground_color.add(this.robot.map.material.color, 'b',0,1);
		
		const gui_link_color = gui_colors.addFolder('Links');
		// KE 2 : color range will not increment by step if value initialized to zero
		// KE 2 : put materials and geoms in proper kineval object
		gui_link_color.add(this.robot_material.color, 'r',0,1).step(0.01).listen();
		gui_link_color.add(this.robot_material.color, 'g',0,1).step(0.01).listen();
		gui_link_color.add(this.robot_material.color, 'b',0,1).step(0.01).listen();
		
		const gui_joint_color = gui_colors.addFolder('Joints');
		// KE 2 : color range will not increment by step if value initialized to zero
		gui_joint_color.add(this.joint_material.color, 'r',0,1).step(0.01).listen();
		gui_joint_color.add(this.joint_material.color, 'g',0,1).step(0.01).listen();
		gui_joint_color.add(this.joint_material.color, 'b',0,1).step(0.01).listen();
	},

	initRobotLinksGeoms: function() {
		// KE T: initialize this variable properly 
		this.robot.collision = false; 

			// KE 2 : put this.robot_material into correct object (fixed below?)
			// KE ! : this may need to be moved back into link for loop
		this.robot_material = new THREE.MeshLambertMaterial( { color: 0x00234c, transparent: true, opacity: 0.9 } );

		// create a threejs mesh for link of the robot and add it to scene 
		for (const x in this.robot.links) {
			// create threejs mesh for link
			// handle conversion to ROS coordinate convention
			// KE 2 : create global color constants
			if (typeof this.robot.links_geom_imported === "undefined") { 
				this.robot.links[x].geom = new THREE.Mesh( this.robot.links_geom[x], this.robot_material);
			}
			else if (!this.robot.links_geom_imported) { 
				this.robot.links[x].geom = new THREE.Mesh( this.robot.links_geom[x], this.robot_material);
			}
			else {
				this.robot.links[x].geom = this.robot.links_geom[x];
			}
			this.robot.links[x].geom.name = "robot_link_" + x;

			// add to threejs mesh to scene in world frame
			this.robot.view.scene.add(this.robot.links[x].geom);

			// For collision detection,
			// set the bounding box of robot link in local link coordinates
			this.robot.links[x].bbox = new THREE.Box3;
			//(THREE r62) this.robot.links[x].bbox = this.robot.links[x].bbox.setFromPoints(this.robot.links[x].geom.geometry.vertices);
			this.robot.links[x].bbox = this.robot.links[x].bbox.setFromObject(this.robot.links[x].geom);

			const bbox_geom = new THREE.BoxGeometry(
				this.robot.links[x].bbox.max.x-this.robot.links[x].bbox.min.x,
				this.robot.links[x].bbox.max.y-this.robot.links[x].bbox.min.y,
				this.robot.links[x].bbox.max.z-this.robot.links[x].bbox.min.z
			);

			let i;
			for (i=0;i<bbox_geom.vertices.length;i++) {
				bbox_geom.vertices[i].x += (this.robot.links[x].bbox.max.x-this.robot.links[x].bbox.min.x)/2 + this.robot.links[x].bbox.min.x;
				bbox_geom.vertices[i].y += (this.robot.links[x].bbox.max.y-this.robot.links[x].bbox.min.y)/2 + this.robot.links[x].bbox.min.y;
				bbox_geom.vertices[i].z += (this.robot.links[x].bbox.max.z-this.robot.links[x].bbox.min.z)/2 + this.robot.links[x].bbox.min.z;
			}

			const bbox_material = new THREE.MeshBasicMaterial( { color: 0xFF0000, wireframe:true, visible:true } );

			// KE 2 : move bbox_mesh to proper place within link object
			this.robot.links[x].bbox_mesh = new THREE.Mesh(bbox_geom,bbox_material);
			this.robot.links[x].geom.add(this.robot.links[x].bbox_mesh);

			// xyz axis indicators
			const axis_geom_x = new THREE.Geometry();
			axis_geom_x.vertices.push(
				new THREE.Vector3(0,0,0),
				new THREE.Vector3(1,0,0)
			);
			this.robot.links[x].axis_geom_x = new THREE.Line(axis_geom_x,
				new THREE.LineBasicMaterial({color: 0xFF0000}));
			this.robot.links[x].geom.add(this.robot.links[x].axis_geom_x);

			const axis_geom_y = new THREE.Geometry();
			axis_geom_y.vertices.push(
				new THREE.Vector3(0,0,0),
				new THREE.Vector3(0,1,0)
			);
			this.robot.links[x].axis_geom_y = new THREE.Line(axis_geom_y,
				new THREE.LineBasicMaterial({color: 0x00FF00}));
			this.robot.links[x].geom.add(this.robot.links[x].axis_geom_y);

			const axis_geom_z = new THREE.Geometry();
			axis_geom_z.vertices.push(
				new THREE.Vector3(0,0,0),
				new THREE.Vector3(0,0,1)
			);
			this.robot.links[x].axis_geom_z = new THREE.Line(axis_geom_z,
				new THREE.LineBasicMaterial({color: 0x0000FF}));
			this.robot.links[x].geom.add(this.robot.links[x].axis_geom_z);
		}
	},

	initRobotJointsGeoms: function() {
		// build kinematic hierarchy by looping over each joint in the robot
		//   (object fields can be index through array-style indices, object[field] = property)
		//   and insert threejs scene graph (each joint and link are directly connect to scene root)
		// NOTE: kinematic hierarchy is maintained independently by this code, not threejs
		// NOTE: _m.simpleApplyMatrix can be used to set threejs transform for a rendered object

		// const x;
		// const tempmat;
		// create threejs geometry for joint origin 
		const material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
		const invisible_geom = new THREE.CubeGeometry( 0.01, 0.01, 0.01 );

		// create threejs geometry for joint
		const temp_material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

		const joints_geom = new THREE.CubeGeometry( 0.01, 0.01, 0.01 );

		// KE 2 : create global color constants
		// KE 2 : fix lighting, use ambient until fixed
		this.joint_material = new THREE.MeshBasicMaterial( {color: 0xffc90b} );
		//this.joint_material = new THREE.MeshLambertMaterial( {color: 0xffc90b} );
		//this.joint_material = new THREE.MeshLambertMaterial( {color: 0xff0000} );

		for (const x in this.robot.joints) {
			// create threejs meshes for joints
			this.robot.joints[x].origin.geom = new THREE.Mesh( invisible_geom, material );
			this.robot.joints[x].geom = new THREE.Mesh( joints_geom, temp_material );

			let joint_geom;
			// Note: kinematics are maintained independently from threejs scene graph
			// add joint geometry to threejs scene graph, added SG node transforms cylinder geometry
			// handle conversion to ROS coordinate convention
			if (typeof this.robot.links_geom_imported === "undefined") {
				joint_geom = new THREE.CylinderGeometry( 0.2, 0.2, 0.2, 20, 3, false );  // cylinder axis aligns with along y-axis in object space
				// joint_geom = new THREE.CylinderGeometry( 0.12, 0.12, 0.02, 20, 3, false );  // cylinder axis aligns with along y-axis in object space
			} else if (this.robot.links_geom_imported) {
				joint_geom = new THREE.CylinderGeometry( 0.12, 0.12, 0.02, 20, 3, false );  // cylinder axis aligns with along y-axis in object space
			} else {
				joint_geom = new THREE.CylinderGeometry( 0.2, 0.2, 0.2, 20, 3, false );  // cylinder axis aligns with along y-axis in object space
			}

			this.robot.joints[x].display_geom = new THREE.Mesh(joint_geom, this.joint_material); 

			// STENCIL: update _m.vector_normalize for joint cylinder placement
			// if joint axis not aligned with y-axis, rotate 3js cylinder axis to align with y
			if (typeof _m.vector_cross !== 'undefined')
			if (!((this.robot.joints[x].axis[0] === 0) && (this.robot.joints[x].axis[2] === 0))) {
				const tempaxis = _m.vector_normalize(_m.vector_cross(this.robot.joints[x].axis,[0,-1,0]));
				//let tempaxis = _m.vector_cross(this.robot.joints[x].axis,[0,-1,0]);
				const temp3axis = new THREE.Vector3(tempaxis[0],tempaxis[1],tempaxis[2]);
				// baked in dot product given cylinder axis is normal along y-axis
				const tempangle = Math.acos(this.robot.joints[x].axis[1]);
				this.robot.joints[x].display_geom.rotateOnAxis(temp3axis,tempangle);
			}
			this.robot.view.scene.add(this.robot.joints[x].geom);
			this.robot.joints[x].geom.add(this.robot.joints[x].display_geom);

			// KE 3 : vary axis size
			const axis_geom_x = new THREE.Geometry();
			axis_geom_x.vertices.push(
				new THREE.Vector3(0,0,0),
				new THREE.Vector3(1,0,0)
			);
			this.robot.joints[x].axis_geom_x = new THREE.Line(axis_geom_x,
				new THREE.LineBasicMaterial({color: 0xFF0000}));
			this.robot.joints[x].geom.add(this.robot.joints[x].axis_geom_x);

			const axis_geom_y = new THREE.Geometry();
			axis_geom_y.vertices.push(
				new THREE.Vector3(0,0,0),
				new THREE.Vector3(0,1,0)
			);
			this.robot.joints[x].axis_geom_y = new THREE.Line(axis_geom_y,
				new THREE.LineBasicMaterial({color: 0x00FF00}));
			this.robot.joints[x].geom.add(this.robot.joints[x].axis_geom_y);

			const axis_geom_z = new THREE.Geometry();
			axis_geom_z.vertices.push(
				new THREE.Vector3(0,0,0),
				new THREE.Vector3(0,0,1)
			);
			this.robot.joints[x].axis_geom_z = new THREE.Line(axis_geom_z,
				new THREE.LineBasicMaterial({color: 0x0000FF}));
			this.robot.joints[x].geom.add(this.robot.joints[x].axis_geom_z);
		}
	},

	initWorldPlanningScene: function() {
		// currently just sets rendering geometries
		// world defined by this.robot.world.robot_boundary and this.robot.world.robot_obstacles objects in separate js include

		// set rendering geometries of world boundary
		let temp_material = new THREE.MeshLambertMaterial( { color: 0xaf8c73, transparent: true, opacity: 0.6} );

		let temp_geom = new THREE.CubeGeometry(this.robot.world.robot_boundary[1][0]-this.robot.world.robot_boundary[0][0],0.2,0.2);
		let temp_mesh = new THREE.Mesh(temp_geom, temp_material);
		temp_mesh.position.x = (this.robot.world.robot_boundary[1][0]+this.robot.world.robot_boundary[0][0])/2;
		temp_mesh.position.y = 0;
		temp_mesh.position.z = this.robot.world.robot_boundary[0][2];
		this.robot.view.scene.add(temp_mesh);

		temp_geom = new THREE.CubeGeometry(this.robot.world.robot_boundary[1][0]-this.robot.world.robot_boundary[0][0],0.2,0.2);
		temp_mesh = new THREE.Mesh(temp_geom, temp_material);
		temp_mesh.position.x = (this.robot.world.robot_boundary[1][0]+this.robot.world.robot_boundary[0][0])/2;
		temp_mesh.position.y = 0;
		temp_mesh.position.z = this.robot.world.robot_boundary[1][2];
		this.robot.view.scene.add(temp_mesh);

		temp_geom = new THREE.CubeGeometry(0.2,0.2,this.robot.world.robot_boundary[1][2]-this.robot.world.robot_boundary[0][2]);
		temp_mesh = new THREE.Mesh(temp_geom, temp_material);
		temp_mesh.position.x = this.robot.world.robot_boundary[0][0];
		temp_mesh.position.y = 0;
		temp_mesh.position.z = (this.robot.world.robot_boundary[1][2]+this.robot.world.robot_boundary[0][2])/2;
		this.robot.view.scene.add(temp_mesh);

		temp_geom = new THREE.CubeGeometry(0.2,0.2,this.robot.world.robot_boundary[1][2]-this.robot.world.robot_boundary[0][2]);
		temp_mesh = new THREE.Mesh(temp_geom, temp_material);
		temp_mesh.position.x = this.robot.world.robot_boundary[1][0];
		temp_mesh.position.y = 0;
		temp_mesh.position.z = (this.robot.world.robot_boundary[1][2]+this.robot.world.robot_boundary[0][2])/2;
		this.robot.view.scene.add(temp_mesh);

		// set rendering geometries of world obstacles
		let  i;
		for (i=0;i<this.robot.world.robot_obstacles.length;i++) { 
			temp_geom = new THREE.SphereGeometry(this.robot.world.robot_obstacles[i].radius);
			temp_material = new THREE.MeshLambertMaterial( { color: 0xaf8c73, transparent: true, opacity: 0.6 } );
			temp_mesh = new THREE.Mesh(temp_geom, temp_material);
			temp_mesh.position.x = this.robot.world.robot_obstacles[i].location[0][0];
			temp_mesh.position.y = this.robot.world.robot_obstacles[i].location[1][0];
			temp_mesh.position.z = this.robot.world.robot_obstacles[i].location[2][0];
			this.robot.view.scene.add(temp_mesh);
		}
	},

	loadJSFile: function(filename,kineval_object) { 
	// load JavaScript file dynamically from filename, and (optionally) assign to recognized field of kineval object
	// WARNING: execution of the kineval main loop must wait until the specified file is loaded.  For the browser, this is accomplished by having this.start() called within the window.onload() function of the executing HTML document

		// create HTML script element and set its type and source file
		const robotDefinitionElement = document.createElement('script');
		robotDefinitionElement.setAttribute("type","text/javascript");
		robotDefinitionElement.setAttribute("src",filename);

		// assuming this element is created, append it to the head of the referring HTML document
		if (typeof robotDefinitionElement !== 'undefined') {
			document.getElementsByTagName("head")[0].appendChild(robotDefinitionElement);
			this[kineval_object+"_file"] = filename;
		} else {
			console.warn("kineval: "+filename+" not loaded");
		}

		if (kineval_object!=="robot" && kineval_object!=="world" && kineval_object!=="floor") {
			console.warn("kineval: JS file loaded, object type "+kineval_object+" not recognized");
		}
	},
/*
	tempPointCloud: function() {

		// KE T: create point cloud
		// define pointcloud
		const pointcloud = []; // with actual points

		let i;
		const pcloud_geom = [];
		const pcloud_material = [];
		for (i=0;i<pointcloud_meta.width;i++) {
			pcloud_geom[i] = new THREE.Geometry();
			// draw point cloud all black
			let colortmp = 0x000000;

			// stripe columns with color
			if (i % 40 < 20) {
				// colortmp = 0xFF0000; // red
				// fade columns from red to blue
				colortmp = Math.pow(2,16)*Math.round((255*(pointcloud_meta.width-i)/pointcloud_meta.width))+0x0000FF*(i/pointcloud_meta.width);
			}

			// THREE r62
			// pcloud_material[i] = new THREE.ParticleBasicMaterial({
			//	color: colortmp,
			//	size: 0.020
			//}); 
			
			pcloud_material[i] = new THREE.PointsMaterial({ color: colortmp, size: 0.020 }); 
		}

		//pcloud_geom.vertices = pointcloud;
		let angle = 2.6*Math.PI/4;
		let mean = [0,0,0,0];
		//for (i=0;i<pointcloud.length;i+=10) {
		for (i=0;i<pointcloud.length;i++) {
			pointcloud[i][0] = Number(pointcloud[i][0]);
			pointcloud[i][1] = Number(pointcloud[i][1]);
			pointcloud[i][2] = Number(pointcloud[i][2]);
			mean[0] += pointcloud[i][0]/(pointcloud.length/1);
			mean[1] += pointcloud[i][1]/(pointcloud.length/1);
			mean[2] += pointcloud[i][2]/(pointcloud.length/1);
		}

		pointcloud;
		const particletmp;

		// for (i=0;i<pointcloud.length;i+=10) {
		for (i=0;i<pointcloud.length;i++) {
			if (0===1) { // apply transform 
			particletmp = new THREE.Vector3(
				pointcloud[i][0]-mean[0],
				pointcloud[i][1]-mean[1],
				pointcloud[i][2]-mean[2]);
			particle = new THREE.Vector3(
				1*particletmp.x+0*particletmp.y+0*particletmp.z+2,
				0*particletmp.x+Math.cos(angle)*particletmp.y+-1*Math.sin(angle)*particletmp.z+0.5,
				0*particletmp.x+Math.sin(angle)*particletmp.y+Math.cos(angle)*particletmp.z+0
				);
			} 
			particle = new THREE.Vector3(
				pointcloud[i][0],
				pointcloud[i][1],
				pointcloud[i][2]);

			// if (pointcloud_meta.idxmap[i]%pointcloud_meta.width == 200)
			// pcloud_geom.vertices.push(particle);
			pcloud_geom[pointcloud_meta.idxmap[i]%pointcloud_meta.width].vertices.push(particle);
		}

		// pcloud = new THREE.ParticleSystem(pcloud_geom,pcloud_material);
		// this.robot.view.scene.add(pcloud);

		for (i=0;i<pointcloud_meta.width;i++) {
			// THREE r62 pcloud = new THREE.ParticleSystem(pcloud_geom[i],pcloud_material[i]);
			pcloud = new THREE.Points(pcloud_geom[i],pcloud_material[i]);
			this.robot.view.scene.add(pcloud);
		}

	/* normal computation
		chosenidx = 40000;
	  for (chosenidx=40000;chosenidx<40500;chosenidx+=20) { 
	  // for (chosenidx=500;chosenidx<pointcloud.length;chosenidx+=20000) { 
	  // for (chosenidx=40000;chosenidx<41100;chosenidx+=1000) { 
		pcloud_point_centered = [];
		pcloud_point_weights = [];
		pcloud_point_weighted = [];
		let sum_weight = 0;
		for (i=0;i<pointcloud.length;i++) {
			pcloud_point_centered[i] = [];
			pcloud_point_centered[i][0] = pointcloud[i][0]-pointcloud[chosenidx][0];
			pcloud_point_centered[i][1] = pointcloud[i][1]-pointcloud[chosenidx][1];
			pcloud_point_centered[i][2] = pointcloud[i][2]-pointcloud[chosenidx][2];
			// pcloud_point_weights[i] = Math.exp(-numeric.dot(pointcloud[chosenidx],pointcloud[i])/Math.pow(0.2,2));
			pcloud_point_weights[i] = Math.exp(-Math.pow(numeric.norm2(numeric.sub(pointcloud[chosenidx],pointcloud[i])),2)/Math.pow(1.8,2));
			sum_weight += pcloud_point_weights[i];
			// perform numeric.dot(numeric.diag(pcloud_point_weighted),pointcloud)
			pcloud_point_weighted[i] = [];
			pcloud_point_weighted[i][0] = pcloud_point_weights[i]*pcloud_point_centered[i][0];
			pcloud_point_weighted[i][1] = pcloud_point_weights[i]*pcloud_point_centered[i][1];
			pcloud_point_weighted[i][2] = pcloud_point_weights[i]*pcloud_point_centered[i][2];
		}
		console.log(chosenidx+" "+sum_weight); 
		pcloud_point_centered_transpose = numeric.transpose(pcloud_point_centered);
		// cov = numeric.div(numeric.dot(pcloud_point_centered_transpose,numeric.dot(numeric.diag(pcloud_point_weighted),pointcloud))/(pointcloud.length-1));
		cov = numeric.div(numeric.dot(pcloud_point_centered_transpose,pcloud_point_weighted),pointcloud.length-1);
		eigs = numeric.eig(cov);

		let material = new THREE.LineBasicMaterial({
			color: 0x00ff00
		});
		let material2 = new THREE.LineBasicMaterial({
			color: 0x00ffff
		});

		for (i=2;i<3;i++) {
			let geometry = new THREE.Geometry();
			geometry.vertices.push(
		  new THREE.Vector3( pointcloud[chosenidx][0], pointcloud[chosenidx][1], pointcloud[chosenidx][2] ),
		  new THREE.Vector3( pointcloud[chosenidx][0]+0.1*eigs.E.x[i][0], pointcloud[chosenidx][1]+0.1*eigs.E.x[i][1], pointcloud[chosenidx][2]+0.1*eigs.E.x[i][2] )
			);

			if (i == 2)
			let line = new THREE.Line( geometry, material );
			else
			line = new THREE.Line( geometry, material2 );

			this.robot.view.scene.add( line );
		}
	  } // chosenidx
	*/  // normal computation
//	},

	startingPlaceholderInit: function() {

		// console.log(JSON.stringify(robot));  // just to see initial starting robot object
		// console.log(robot);  // same thing but displayed as an object. click it in the console

		// const local_spacing = 0.9;  // variables declared with "var" are local 
		this.robot.global_spacing = 0.9;  // variables declared with "var" are global
		this.robot.vert_offset = 1;  // this could be useful later
		this.robot.jitter_radius = 0.02;  // and this too

		const my_object = {};  // objects can be created with braces
		my_object.university = "Michigan";  // create object property with an assignment
		my_object["department"] = "EECS";  // equivalent to my.object.department = "EECS";
		my_object.course_number = 398;  // this is a number
		my_object.course_number = my_object.course_number*Math.pow(10,3) + 2;  // this is a number = 398002; + operator adds number
		my_object.course_number = Math.floor(my_object.course_number/1000).toString() + "-" + "00" + (my_object.course_number%1000).toString();  // this is a string; + operator concatenates strings
		
		const string_containing_the_word_subject = "subject";
		my_object[string_containing_the_word_subject] = "robotics"; // not equivalent to my_object.string_containing_the_word_subject = "robotics";

		// typeof can be used to test whether an object is defined
		if (typeof copied_object === 'undefined') {  // if copied_object does not already exist
			console.warn(my_object);  // check it out on the console  
			console.warn(JSON.stringify(my_object));  // same thing as a string  

			// objects are copied by reference
			const copied_object = my_object;
			copied_object.subject = "autonomous_robotics";  // what is my_object.subject on the console?
			// view object at the console prompt, type "copied_object" and press enter
		}

		// let empty_array = [];  // this creates an object as an empty array
		const my_array = [8, 6, 7, 5, 3, 0, 9]; // this creates a 7-element array
		my_array[6] = 'ni-i-i-ine';  // replace the sixth element with a string

		let i;  // local variable for iterating through array
		for (i=0;i<my_array.length;i++) {
			console.warn(my_array[i]);
		}

		// create a text element to display a message
		this.robot.textbar = document.createElement('div'); // create an empty div element 
		this.robot.textbar.style.position = 'absolute'; // set element style parameters
		this.robot.textbar.style.width = window.innerWidth-10;
		this.robot.textbar.style.height = 20;
		this.robot.textbar.style.top = 10 + 'px';
		this.robot.textbar.style.left = 10 + 'px';
		this.robot.textbar.style["font-family"] = "Monospace";
		//this.robot.textbar.style.backgroundColor = "black";
		this.robot.textbar.style.color = "#00ff00";
		//this.robot.textbar.style.zIndex = 1;    // if you still don't see the textbar, try uncommenting this
		this.robot.textbar.innerHTML = "autorob.github.io";


		// comment this out when handilng multiple robots
		document.body.appendChild(this.robot.textbar);  // put element into document body
	},

	startingPlaceholderAnimate: function() {
		// this starting point routine is to show how rigid bodies are displayed andtransformed interactively based on user controls

		// in this example, each link of robot will be spaced evenly apart, centered along the x-axis and floating along y-axis using a translation matrix.  additional translational offsets will be controlled interactive through key controls

		// HANDLE USER KEY INTERACTION

		// keyboard is threejs helper for reading keyboard state
		if (this.keyboard.pressed("x")) {
			this.robot.textbar.innerHTML = "moving on up";  // make the pieces move up
		// STENCIL: update the vertical offset variable
			this.robot.vert_offset += 0.2;
		} else if (this.keyboard.pressed("c")) {
			this.robot.textbar.innerHTML = "moving on up";  // make the pieces move up
			this.robot.vert_offset -= 0.2;
		} else if (this.keyboard.pressed("z")) {
			this.robot.textbar.innerHTML = "relax your mind, let your conscience be free";  // stop jittering the pieces
		// STENCIL: update the radius of the jittering
			this.robot.jitter_radius = 0;
		} else if (this.keyboard.pressed("shift+1")) { 
			this.robot.textbar.innerHTML = "get a move on";  // increase spacing
		// STENCIL: update the global spacing variable
			this.robot.global_spacing += 0.2;
		} else if (this.keyboard.pressed("1")) {
			this.robot.textbar.innerHTML = "come together";  // decrease spacing
		// STENCIL: update the global spacing variable
			this.robot.global_spacing -= 0.2;
		} else {
			// make the pieces jitter, and say something more interesting
			this.robot.textbar.innerHTML = "Welcome to this. I want to see some text. Can you place a message here?";  // set message text
			this.robot.vert_offset = 1;
			this.robot.jitter_radius = 0.2;
		}

		// CREATE TRANSFORMATION MATRIX

		// jsmat is the matrix data structure used to separately transform each 3D object to a specific location in the world
		// we will represent matrices with index notation, such that matrix[row][column] indexes into elements of the matrix
		const jsmat = [
					[1, 0, 0, 0],
					[0, 1, 0, 0],
					[0, 0, 1, 0],
					[0, 0, 0, 1] 
		];

		// TRANSLATE ROBOT JOINTS

		// jsmat[0][3] corresponds to the x-coordinate of the position for the 3D object
		// Object.key(object) is a rough way to get number of keys in an object, in this case the number of joints in the this.robot.joints object
		// this offset will perform the centering along the x-axis
		jsmat[0][3] = -Object.keys(this.robot.joints).length*this.robot.global_spacing/2;  

		// iterate over each joint of the robot independently, creating a unique translation matrix for each joint, and setting its 3D transform
		for (const x in this.robot.joints) {

			// jsmat[1][3] corresponds to the y-coordinate of the position for the 3D object
			jsmat[1][3] = (this.robot.vert_offset+1)+Math.random()*this.robot.jitter_radius;  // the Math object has lots of helpful functions, such as random number generation

			// jsmat[2][3] corresponds to the z-coordinate of the position for the 3D object
			jsmat[2][3] = Math.random()*this.robot.jitter_radius;

			// add spacing offset for translation of next joint geometry
			jsmat[0][3] += this.robot.global_spacing;

			// apply matrix to transform
			this.robot.joints[x].xform = _m.matrix_copy(jsmat);
		} 

		// TRANSLATE ROBOT LINKS

		// iterate over each link of the robot independently
		jsmat[0][3] = -Object.keys(this.robot.joints).length*this.robot.global_spacing/2;
		for (const x in this.robot.links) {
			jsmat[1][3] = this.robot.vert_offset+Math.random()*this.robot.jitter_radius;
			jsmat[2][3] = Math.random()*this.robot.jitter_radius;
			jsmat[0][3] += this.robot.global_spacing;
			this.robot.links[x].xform = _m.matrix_copy(jsmat);
		}
	},

	initRobot: function initRobot() {
		// ASSUME: robot kinematics are described separate js file (eg., "robot_urdf_example.js")

		// initialize and create threejs mesh objects for robot links
		this.initRobotLinks();

		// initialize robot joints and create threejs mesh objects for robot joints and form kinematic hiearchy
		this.initRobotJoints();

		// initialize robot collision state
		this.robot.collision = false;
	},

	initRobotLinks: function initRobotLinks() {
		for (const x in this.robot.links) {
			this.robot.links[x].name = x;
		}

		// initialize controls for robot base link
		this.robot.control = {xyz: [0,0,0], rpy:[0,0,0]}; 
	},

	initRobotJoints: function initRobotJoints() {
		// build kinematic hierarchy by looping over each joint in the robot
		//   (object fields can be index through array-style indices, object[field] = property)
		//   and insert threejs scene graph (each joint and link are directly connect to scene root)
		// NOTE: kinematic hierarchy is maintained independently by this code, not threejs

		// let x,tempmat;

		for (const x in this.robot.joints) {

			// give the joint its name as an id
			this.robot.joints[x].name = x;

			// initialize joint angle value and control input value
			this.robot.joints[x].angle = 0;
			this.robot.joints[x].control = 0;
			this.robot.joints[x].servo = {};
		// STENCIL: set appropriate servo gains for arm setpoint control
			this.robot.joints[x].servo.p_gain = 0.1; 
			this.robot.joints[x].servo.p_desired = 0.5;
			this.robot.joints[x].servo.d_gain = 0; 

		// STENCIL: complete kinematic hierarchy of robot for convenience.
		//   robot description only specifies parent and child links for joints.
		//   additionally specify parent and child joints for each link

			// var _parent = this.robot.joints[x].parent;
			if (this.robot.links[this.robot.joints[x].parent].children === undefined) { 
				this.robot.links[this.robot.joints[x].parent].children = [];
			}

			// set parent.children
			this.robot.links[this.robot.joints[x].parent].children.push(this.robot.joints[x].name);

			// set child.parent
			this.robot.links[this.robot.joints[x].child].parent = this.robot.joints[x].name;
		}
	},

	initKeyEvents: function init_keyboard_events() {
		document.addEventListener('keydown', (e) => {this.handleKeydown(e.keyCode); }, true);
	},

	handleKeydown: function handle_keydown(keycode) {
		//console.log("handle_keydown: "+keycode);
		switch (keycode) { // h:72 j:74 k:75 l:76
		case 74: // j 
			this.changeActiveLinkDown();
			break;
		case 75: // k
			this.changeActiveLinkUp();
			break;
		case 76: // l
			this.changeActiveLinkNext();
			break;
		case 72: // h
			this.changeActiveLinkPrevious();
			break;
		case 84: // t
			this.toggleStartpointMode();
			break;
		case 37: // arrow down
			this.rosCmdVel.publish(this.rosTwistLft);
			console.warn('trying to move left');
			break;
		case 38: // arrow up
			this.rosCmdVel.publish(this.rosTwistFwd);
			console.warn('trying to move forward');
			break;
		case 39: // arrow up
			this.rosCmdVel.publish(this.rosTwistRht);
			console.warn('trying to move right');
			break;
		case 40: // arrow left
			this.rosCmdVel.publish(this.rosTwistBwd);
			console.warn('trying to move backward');
			break;
		case 13: // enter
			this.rosManip.publish(this.rosManipGrasp);
			console.warn('trying to grasp');
			break;
		}
	},

	handleUserInput: function user_input() {
	/*
		// KE T : what is going on here?
		// reset this.robot.view.camera to face robot
		if (this.keyboard.pressed("z") ) {
			this.robot.view.camera.position.x = this.robot.origin.xyz[0];
			this.robot.view.camera.position.y = this.robot.origin.xyz[1]+1;
			this.robot.view.camera.position.z = this.robot.origin.xyz[2]+4;

			// this.robot.view.camera will reset once view command given through mouse
			// not sure why statements below and this.robot.view.camera.lookAt() do not work
			//this.robot.view.cameraControls.target.x = this.robot.links[this.robot.base].geom.position.x;
			//this.robot.view.cameraControls.target.y = this.robot.links[this.robot.base].geom.position.y;
			//this.robot.view.cameraControls.target.z = this.robot.links[this.robot.base].geom.position.z;
		}
	*/

		if (this.keyboard.pressed("z")) {
			this.robot.view.camera.position.x += 0.1*(this.robot.origin.xyz[0]-this.robot.view.camera.position.x);
			this.robot.view.camera.position.y += 0.1*(this.robot.origin.xyz[1]-this.robot.view.camera.position.y);
			this.robot.view.camera.position.z += 0.1*(this.robot.origin.xyz[2]-this.robot.view.camera.position.z);
		}
		else if (this.keyboard.pressed("x")) {
			this.robot.view.camera.position.x -= 0.1*(this.robot.origin.xyz[0]-this.robot.view.camera.position.x);
			this.robot.view.camera.position.y -= 0.1*(this.robot.origin.xyz[1]-this.robot.view.camera.position.y);
			this.robot.view.camera.position.z -= 0.1*(this.robot.origin.xyz[2]-this.robot.view.camera.position.z);
		}

		// request generation of motion plan
		if (this.keyboard.pressed("m")) {
			this.robot.params.update_motion_plan = true;
		}

		// traverse generated motion plan
		if (this.keyboard.pressed("n") | this.keyboard.pressed("b")) {
			this.robot.params.update_motion_plan_traversal = true;

			if (this.robot.motion_plan.length > 0) {
				// increment index
				if ((this.keyboard.pressed("n"))&&(this.robot.motion_plan_traversal_index<this.robot.motion_plan.length-1)) {
					this.robot.motion_plan_traversal_index++; 
					this.robot.textbar.innerHTML = "moved robot forward along planned motion trajectory";
				}
				if ((this.keyboard.pressed("b"))&&(this.robot.motion_plan_traversal_index>0)) {
					this.robot.motion_plan_traversal_index--;
					this.robot.textbar.innerHTML = "moved robot backward along planned motion trajectory";
				}
			}
		}

		// execute inverse kinematics
		if (this.keyboard.pressed("p") )
			this.robot.params.update_ik = true;

		// execute PID controller to setpoint
		if (this.keyboard.pressed("o") ) {
			this.robot.params.update_pd = true;
			this.robot.params.update_pd_clock = false;
			this.robot.params.update_pd_dance = false;
		}

		// execute PID controller to clock
		if (this.keyboard.pressed("c") ) {
			this.robot.params.update_pd = true;
			this.robot.params.update_pd_clock = true;
		}

		// textbar messages
		if (this.robot.params.update_pd||this.robot.params.persist_pd) {
			this.robot.textbar.innerHTML = "joint servo controller has been invoked";
			if (this.robot.params.update_pd_clock) 
				this.robot.textbar.innerHTML += "<br>executing clock movement about each joint";
			if (this.robot.params.update_pd_dance) 
				this.robot.textbar.innerHTML += "<br>executing setpoint pose " + this.robot.params.dance_pose_index + " of " + this.robot.params.dance_sequence_index.length;
		}
		if (this.robot.params.update_ik||this.robot.params.persist_ik) { 
			if (!this.robot.params.trial_ik_random.execute) 
				this.robot.textbar.innerHTML = "inverse kinematics controller has been invoked";
		}
		if (this.robot.params.generating_motion_plan) 
			this.robot.textbar.innerHTML = "motion planner has been invoked in the background";


		// incrment/decrement angle of active joint 
		if (this.keyboard.pressed("u")) {
			this.robot.textbar.innerHTML = "active joint is moving in positive direction";
			this.robot.joints[this.robot.params.active_joint].control += 0.01;  // add motion increment 
		}
		else if (this.keyboard.pressed("i")) {
			this.robot.textbar.innerHTML = "active joint is moving in negative direction";
			this.robot.joints[this.robot.params.active_joint].control += -0.01;  // add motion increment 
		}

		// move robot base in the ground plane
		if (this.keyboard.pressed("a")) {  // turn
			this.robot.textbar.innerHTML = "turning base left";
			this.robot.control.rpy[1] += 0.1;
		}
		if (this.keyboard.pressed("d")) {  // turn
			this.robot.textbar.innerHTML = "turning base right";
			this.robot.control.rpy[1] += -0.1;
		}
		if (this.keyboard.pressed("w")) {  // forward
			this.robot.textbar.innerHTML = "moving base forward";
			//this.robot.origin.xyz[2] += 0.1;  // simple but ineffective: not aligned with robot
			this.robot.control.xyz[2] += 0.1 * (this.robot.heading[2][0]-this.robot.origin.xyz[2]);
			this.robot.control.xyz[0] += 0.1 * (this.robot.heading[0][0]-this.robot.origin.xyz[0]);
		}
		if (this.keyboard.pressed("s")) {  // backward
			this.robot.textbar.innerHTML = "moving base backward";
			//this.robot.origin.xyz[2] -= 0.1; // simple but ineffective: not aligned with robot
			this.robot.control.xyz[2] += -0.1 * (this.robot.heading[2][0]-this.robot.origin.xyz[2]);
			this.robot.control.xyz[0] += -0.1 * (this.robot.heading[0][0]-this.robot.origin.xyz[0]);
		}
		// KE : this needs to be stencilized
		if (this.keyboard.pressed("q")) {  // strafe
			this.robot.textbar.innerHTML = "moving base left";
			//this.robot.origin.xyz[0] += 0.1; // simple but ineffective: not aligned with robot

			this.robot.control.xyz[2] += 0.1 * (this.robot.lateral[2][0]-this.robot.origin.xyz[2]);
			this.robot.control.xyz[0] += 0.1 * (this.robot.lateral[0][0]-this.robot.origin.xyz[0]);
		}
		if (this.keyboard.pressed("e") ) {  // strafe
			this.robot.textbar.innerHTML = "moving base right";
			// this.robot.origin.xyz[0] -= 0.1; // simple but ineffective: not aligned with robot

			this.robot.control.xyz[2] += -0.1 * (this.robot.lateral[2][0]-this.robot.origin.xyz[2]);
			this.robot.control.xyz[0] += -0.1 * (this.robot.lateral[0][0]-this.robot.origin.xyz[0]);
		}

		if (this.keyboard.pressed("0")) {
			setPoseSetpoint(this.robot, 0);
		}

		if (this.keyboard.pressed("shift+1")) {
			assignPoseSetpoint(this.robot, 1);
		} else if (this.keyboard.pressed("1")) {
			setPoseSetpoint(this.robot, 1);
		}

		if (this.keyboard.pressed("shift+2")) {
			assignPoseSetpoint(this.robot, 2);
		} else if (this.keyboard.pressed("2")) {
			setPoseSetpoint(this.robot, 2);
		}

		if (this.keyboard.pressed("shift+3")) {
			assignPoseSetpoint(this.robot, 3);
		} else if (this.keyboard.pressed("3")) {
			setPoseSetpoint(this.robot, 3);
		}

		if (this.keyboard.pressed("shift+4")) {
			assignPoseSetpoint(this.robot, 4);
		} else if (this.keyboard.pressed("4")) {
			setPoseSetpoint(this.robot, 4);
		}

		if (this.keyboard.pressed("shift+5")) {
			assignPoseSetpoint(this.robot, 5);
		} else if (this.keyboard.pressed("5")) {
			setPoseSetpoint(this.robot, 5);
		}

		if (this.keyboard.pressed("shift+6")) { 
			assignPoseSetpoint(this.robot, 6);
		} else if (this.keyboard.pressed("6")) {
			setPoseSetpoint(this.robot, 6);
		}

		if (this.keyboard.pressed("shift+7")) {
			assignPoseSetpoint(this.robot, 7);
		} else if (this.keyboard.pressed("7")) {
			setPoseSetpoint(this.robot, 7);
		}

		if (this.keyboard.pressed("shift+8")) {
			assignPoseSetpoint(this.robot, 8);
		} else if (this.keyboard.pressed("8")) {
			setPoseSetpoint(this.robot, 8);
		}

		if (this.keyboard.pressed("shift+9")) {
			assignPoseSetpoint(this.robot, 9);
		} else if (this.keyboard.pressed("9")) {
			setPoseSetpoint(this.robot, 9);
		}

		if (this.keyboard.pressed("shift+r") ) {
			this.robot.params.ik_target.orientation[0] += 0.01;
			this.robot.textbar.innerHTML = "ik orient: " + this.robot.params.ik_target.orientation[0];
		} else if (this.keyboard.pressed("r") ) {
			this.robot.textbar.innerHTML = "moving IK target up";
			this.robot.params.ik_target.position[1][0] += 0.01;
		}

		if (this.keyboard.pressed("shift+f") ) {
			this.robot.params.ik_target.orientation[0] -= 0.01;
			this.robot.textbar.innerHTML = "ik orient: " + this.robot.params.ik_target.orientation[0];
		} else if (this.keyboard.pressed("f") ) {
			this.robot.textbar.innerHTML = "moving IK target down";
			this.robot.params.ik_target.position[1][0] -= 0.01;
		}

		if (this.keyboard.pressed("g")) {
			this.robot.textbar.innerHTML = "pose setpoints printed to console";
			console.warn(JSON.stringify(this.robot.setpoints));
		}

		if (this.keyboard.pressed("v")) {
			this.displayHelp();
		}
	},

	displayHelp: function display_help () {
		this.robot.textbar.innerHTML = "kineval user interface commands" 
		+ "<br>mouse: rotate camera about robot base "
		+ "<br>z/x : camera zoom with respect to base "
		+ "<br>t : toggle starting point mode "
		+ "<br>w/s a/d q/e : move base along forward/turning/strafe direction"
		+ "<br>j/k/l : focus active joint to child/parent/sibling "
		+ "<br>u/i : control active joint"
		+ "<br>c : execute clock tick controller "
		+ "<br>o : control robot arm to current setpoint target "
		+ "<br>0 : control arm to zero pose "
		+ "<br>Shift+[1-9] : assign current pose to a pose setpoint"
		+ "<br>[1-9] : assign a pose setpoint to current setpoint target"
		+ "<br>g : print pose setpoints to console "
		+ "<br>p : iterate inverse kinematics motion "
		+ "<br>r/f : move inverse kinematics target up/down"
		+ "<br>m : invoke motion planner "
		+ "<br>n/b : show next/previous pose in motion plan "
		+ "<br>h : toggle gui command widget ";
		+ "<br>v : print commands to screen ";
	},

	toggleStartpointMode: function toggle_startpoint_mode() {
		this.robot.textbar.innerHTML = "toggled startpoint mode";
		this.robot.params.just_starting = !this.robot.params.just_starting;
	},


	kchangeActiveLinkDown: function change_active_link_down() {
		if (typeof this.robot.links[this.robot.joints[this.robot.params.active_joint].child].children !== 'undefined') {
			this.robot.params.active_link = this.robot.joints[this.robot.params.active_joint].child;
			this.robot.params.active_joint = this.robot.links[this.robot.params.active_link].children[0];
			this.robot.textbar.innerHTML = this.robot.params.active_joint + " is now the active joint";
		}
	},

	changeActiveLinkUp: function change_active_link_up() {
		if (this.robot.params.active_link !== this.robot.base) {
			this.robot.params.active_joint = this.robot.links[this.robot.params.active_link].parent;
			this.robot.params.active_link = this.robot.joints[this.robot.params.active_joint].parent;
			this.robot.textbar.innerHTML = this.robot.params.active_joint + " is now the active joint";
		}
	},

	changeActiveLinkNext: function change_active_joint_next() {
		this.robot.params.active_joint = this.robot.links[this.robot.params.active_link].children[(this.robot.links[this.robot.params.active_link].children.indexOf(this.robot.params.active_joint)+1) % this.robot.links[this.robot.params.active_link].children.length];
		this.robot.textbar.innerHTML = this.robot.params.active_joint + " is now the active joint";
	},

	changeActiveLinkPrevious: function change_active_joint_previous() {
		this.robot.params.active_joint = this.robot.links[this.robot.params.active_link].children[(this.robot.links[this.robot.params.active_link].children.length + this.robot.links[this.robot.params.active_link].children.indexOf(this.robot.params.active_joint)-1) % this.robot.links[this.robot.params.active_link].children.length];
		this.robot.textbar.innerHTML = this.robot.params.active_joint + " is now the active joint";
	},

	robotForwardKinematics: function robotForwardKinematics () { 
		if (typeof buildFKTransforms === 'undefined') {
			this.robot.textbar.innerHTML = "forward kinematics not implemented";
			return;
		}

		// STENCIL: implement this.buildFKTransforms();
		buildFKTransforms(this.robot);
	},

	robotInverseKinematics() {
		// compute joint angle controls to move location on specified link to Cartesian location
		if ((this.robot.params.update_ik)||(this.robot.params.persist_ik)) { 
			// if update requested, call ik iterator and show endeffector and target
			iterateIK(this.robot);
			if (this.robot.params.trial_ik_random.execute) {
				randomizeIKtrial(this.robot);
			} else { // KE: this use of start time assumes IK is invoked before trial
				this.robot.params.trial_ik_random.start = new Date();
			}
		}

		this.robot.params.update_ik = false; // clear IK request for next iteration
	},

	applyControls: function() {
		robotApplyControls(this.robot);
	},

	applySetpointControls: function() { 
		// if requested, perform setpoint control with joint servo controllers
		executeClock(this.robot); // setpoint clock movement: simple clock tick movement
		executeSetpoints(this.robot); // setpoint dance sequence: dance routine
		robotPdControl(this.robot); // robot arm controller setpoint: PID controller
		this.robot.params.update_pd = false; // clear PID request for next iteration
	},

	planMotionRRTConnect: function() {
		computeMotionPlan(this.robot);
	},

	robotIsCollision: function robot_iscollision() {
		// test whether geometry of current configuration of robot is in collision with planning world 

		// form configuration from base location and joint angles
		let q_robot_config = [
			this.robot.origin.xyz[0],
			this.robot.origin.xyz[1],
			this.robot.origin.xyz[2],
			this.robot.origin.rpy[0],
			this.robot.origin.rpy[1],
			this.robot.origin.rpy[2]
		];

		this.robot.q_names = {};  // store mapping between joint names and q DOFs

		for (const x in this.robot.joints) {
			this.robot.q_names[x] = q_robot_config.length;
			q_robot_config = q_robot_config.concat(this.robot.joints[x].angle);
		}

		// test for collision and change base color based on the result
		const collision_result = testCollision(this.robot, q_robot_config);

		this.robot.collision = collision_result;
	}
};

// ////////////////////////////////////////////////
// ///     ANIMATION AND INTERACTION FUNCTIONS
// ////////////////////////////////////////////////

/*
this.animate = function animate() {

	// THIS IS THE MAIN ANIMATION LOOP

	// note: three.js includes requestAnimationFrame shim
	// alternative to using setInterval for updating in-browser drawing
	// this effectively requests that the animate function be called again for next draw
	// http://learningwebgl.com/blog/?p=3189

	requestAnimationFrame( this.animate );

	// call user's animation routine
	// my_animate();

	// update camera position and render scene
	// this.renderScene();
}
*/

/*
this.renderScene = function renderScene() {

	// threejs rendering update
	renderer.render( scene, camera );
}
*/

// ////////////////////////////////////////////////
// ///     INITIALIZATION FUNCTION DEFINITONS
// ////////////////////////////////////////////////


// ////////////////////////////////////////////////
// ///     CONTROLLER INTERFACE FUNCTIONS
// ////////////////////////////////////////////////

// ////////////////////////////////////////////////
// ///     FILE LOADING FUNCTIONS
// ////////////////////////////////////////////////

// ////////////////////////////////////////////////
// ///     STARTING POINT FUNCTIONS
// ////////////////////////////////////////////////

/*

	 KinEval
	 Implementation of robot kinematics, control, decision making, and dynamics 
	 in HTML5/JavaScript and threejs
	 
	 @author ohseejay / https://github.com/ohseejay / https://bitbucket.org/ohseejay

*/

// ////////////////////////////////////////////////
// ///     ROBOT INITIALIZATION FUNCTIONS
// ////////////////////////////////////////////////

/*

	 KinEval
	 Implementation of robot kinematics, control, decision making, and dynamics 
	 in HTML5/JavaScript and threejs
	 
	 @author ohseejay / https://github.com/ohseejay / https://bitbucket.org/ohseejay

*/

// ////////////////////////////////////////////////
// ///     MATH FUNCTIONS
// ////////////////////////////////////////////////

	// ////////////////////////////////////////////////
	// ///     MATRIX ALGEBRA AND GEOMETRIC TRANSFORMS 
	// ////////////////////////////////////////////////


	// ////////////////////////////////////////////////
	// ///     QUATERNION TRANSFORM ROUTINES 
	// ////////////////////////////////////////////////



// ////////////////////////////////////////////////
// ///     USER INPUT FUNCTIONS
// ////////////////////////////////////////////////

	// ////////////////////////////////////////////////
	// ///     USER INTERACTION SUPPORT ROUTINES
	// ////////////////////////////////////////////////



// ////////////////////////////////////////////////
// ///     FORWARD AND INVERSE KINEMATICS FUNCTIONS
// ////////////////////////////////////////////////


	/*-- |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/|

		KinEval | Kinematic Evaluator | forward kinematics

		Implementation of robot kinematics, control, decision making, and dynamics 
			in HTML5/JavaScript and threejs
		 
		@author ohseejay / https://github.com/ohseejay / https://bitbucket.org/ohseejay

		Chad Jenkins
		Laboratory for Perception RObotics and Grounded REasoning Systems
		University of Michigan

		License: Creative Commons 3.0 BY-SA

	|\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| --*/


	// STENCIL: reference code alternates recursive traversal over 
	//   links and joints starting from base, using following functions: 
	//     traverseFKBase
	//     traverseFKLink
	//     traverseFKJoint
	//
	// user interface needs the heading (z-axis) and lateral (x-axis) directions
	//   of robot base in world coordinates stored as 4x1 matrices in
	//   global variables "this.robot.heading" and "this.robot.lateral"
	//
	// if geometries are imported and using ROS coordinates (e.g., fetch),
	//   coordinate conversion is needed for kineval/threejs coordinates:
	//
	//   if (this.robot.links_geom_imported) {
	//       var offset_xform = _m.matrix_multiply(_m.generate_rotation_matrix_Y(-Math.PI/2),_m.generate_rotation_matrix_X(-Math.PI/2));

	/*-- |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/|

		KinEval | Kinematic Evaluator | inverse kinematics

		Implementation of robot kinematics, control, decision making, and dynamics 
			in HTML5/JavaScript and threejs
		 
		@author ohseejay / https://github.com/ohseejay / https://bitbucket.org/ohseejay

		Chad Jenkins
		Laboratory for Perception RObotics and Grounded REasoning Systems
		University of Michigan

		License: Creative Commons 3.0 BY-SA

	|\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| --*/




// ////////////////////////////////////////////////
// ///     FK/JOINT CONTROL FUNCTIONS
// ////////////////////////////////////////////////

	/*-- |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/|

		KinEval | Kinematic Evaluator | update robot state from controls

		Implementation of robot kinematics, control, decision making, and dynamics 
			in HTML5/JavaScript and threejs
		 
		@author ohseejay / https://github.com/ohseejay / https://bitbucket.org/ohseejay

		Chad Jenkins
		Laboratory for Perception RObotics and Grounded REasoning Systems
		University of Michigan

		License: Creative Commons 3.0 BY-SA

	|\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| --*/


	/*-- |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/|

		KinEval | Kinematic Evaluator | arm servo control

		Implementation of robot kinematics, control, decision making, and dynamics 
			in HTML5/JavaScript and threejs
		 
		@author ohseejay / https://github.com/ohseejay / https://bitbucket.org/ohseejay

		Chad Jenkins
		Laboratory for Perception RObotics and Grounded REasoning Systems
		University of Michigan

		License: Creative Commons 3.0 BY-SA

	|\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| --*/

// ////////////////////////////////////////////////
// ///     MOTION PLANNING FUNCTIONS
// ////////////////////////////////////////////////


	/*-- |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/|

		KinEval | Kinematic Evaluator | RRT motion planning

		Implementation of robot kinematics, control, decision making, and dynamics 
			in HTML5/JavaScript and threejs
		 
		@author ohseejay / https://github.com/ohseejay / https://bitbucket.org/ohseejay

		Chad Jenkins
		Laboratory for Perception RObotics and Grounded REasoning Systems
		University of Michigan

		License: Creative Commons 3.0 BY-SA

	|\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| --*/

	// ////////////////////////////////////////////////
	// ///     RRT MOTION PLANNER
	// ////////////////////////////////////////////////

	// STUDENT: 
	// compute motion plan and output into robot_path array 
	// elements of robot_path are vertices based on tree structure in tree_init() 
	// motion planner assumes collision checking by testCollision()

	/* 

	KE 2 : Notes:
	   - Distance computation needs to consider modulo for joint angles
	   - robot_path[] should be used as desireds for controls
	   - Add visualization of configuration for current sample
	*/

	/*
	STUDENT: reference code has functions for:

	*/


// ////////////////////////////////////////////////
// ///     ROS FUNCTIONS
// ////////////////////////////////////////////////

	// ////////////////////////////////////////////////
	// ///     ROSBRIDGE
	// ////////////////////////////////////////////////



// ////////////////////////////////////////////////
// ///     UTIL FUNCTIONS
// ////////////////////////////////////////////////

