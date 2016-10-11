/*
The view should be its own independent module that accepts messages from the controller
in order to render a sequence of transformations scheduled at specific times (system times)
in the animation loop. --> executed when simulation time = system execution time of the event

The animation loop...[executes how many times per second?] block or non-blocking?...

The DES should communicate events to the view in the form of [start], [end] messages.

In this manner, the view simulation is executed after the DES simulation, whereby the execution
of DES events have a complimentary view event where applicable.

Tonight, bridge DES and view application.
With appropriate unit conversion (convert physical kinematics to simulation kinematics).

Open chrome with the following terminal command:
open -a Google\ Chrome --args --allow-file-access-from-files
*/
import * as THREE from 'three';
import * as Detector from './utils/Detector';

// controls
import buildOrbitControls from './controls/OrbitControls';
import buildTransformControls from './controls/TransformControls';
// import buildFlyControls from './controls/FlyControls';
// import buildPointerLockControls from './controls/PointerLockControls';

// loaders
import buildColladaLoader from './loaders/ColladaLoader';

// world config params
// import * as ConfigParams from '../simulation-model/world/world_config_models/ConfigParams';
// import * as LengthModel from '../simulation-model/world/world_config_models/LengthModel';
// import * as TimeModel from '../simulation-model/world/world_config_models/TimeModel';
// import VariableInterval from '../simulation-model/world/world_config_models/VariableInterval';

// utils: that cannot be imported as node modules
// import PriorityQueue from 'js-priority-queue';

import Stats from 'stats.js';

export default class View {
	constructor() {
		buildTransformControls(THREE);
		buildOrbitControls(THREE);
		buildColladaLoader(THREE);

		//  Texture Loader: load materials
		this.textureLoader = new THREE.TextureLoader();
		this.colladaLoader = new THREE.ColladaLoader();


		// initialize View state
		// Any View configuration prior to the loading of the scene is done here.
		this.renderLoopActive = false;
		this.mainSceneInitialized = false;
	}

	initializeScene() {
		// implement single scene here?????
		this.scene = new THREE.Scene;

		// add simulation view utils
		// this.addAxis(30);
		this.addGrid();

		// set mainSceneInitialized flag to true
		this.mainSceneInitialized = true;
	}

	clearScene(reinitializeScene) {
		// clearing the scene is removing all references to previously defined scene objects and 
		// reinitializing the scene

		// remove all children from the scene. The scene itself is an object3D and root container of all Object3D
		// this.scene.children = [];

		let numCalls = 0;
		let numGeoDisposals = 0;
		let numMatDisposals = 0;
		let numMatGeoDisposals = 0;
		let numMeshGeoDisposals = 0;
		let numMeshMatDisposals = 0;

		const disposeChildrenFn = function(object) { 
			if (object.children) {
				if (object.children.length > 0) { 
					object.children.map(disposeChildrenFn.bind(this));
				}
			}

			this.scene.remove(object);

			if (object.geometry) { 
				object.geometry.dispose();

				numGeoDisposals++;
			}

			if (object.material) {
				if (object.material.children) { 
					if (object.material.children.length > 0) { 
						object.material.children.map(disposeChildrenFn.bind(this));
					}
				}

				if (object.material.geometry) { 
					object.material.geometry.dispose();

					numMatGeoDisposals++;
				}

				if (object.material.map) { 
					object.material.map.dispose();
				}

				object.material.dispose();
				numMatDisposals++;
			}
			if (object.mesh) {
				if (object.mesh.children) {
					if (object.mesh.children.length > 0) { 
						object.mesh.children.map(disposeChildrenFn.bind(this));
					}
				}
				if (object.mesh.geometry) { 
					object.mesh.geometry.dispose();

					numMeshGeoDisposals++;
				}
				if (object.mesh.material) {
					if (object.mesh.material.map) { 
						object.mesh.material.map.dispose();
					}
					object.mesh.material.dispose();
					numMeshMatDisposals++;
				}
			}

			numCalls++;
		}

		// recursively remove all object3ds:
		while (this.scene.children.length > 0) { 
			this.scene.children.map(disposeChildrenFn.bind(this));
		}

		// set previously defined camera, lights, and controls to undefined
		this.camera = undefined;
		this.light = undefined;
		this.userControls = undefined;

		// set mainSceneInitialized flag to false, since the main scene is being destroyed.
		this.mainSceneInitialized = false;

		this._clearRenderer();

		if (reinitializeScene) {
			this.startRenderLoop();
		}
	}

	_initializeRenderer() { 
		this.Detector = Detector; 
		if ( ! this.Detector.webgl ) this.Detector.addGetWebGLMessage();

		// renderer
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMapSoft = true;
		this.renderer.setPixelRatio( window.devicePixelRatio );

		this.addEventListeners();
		
		// remove these chidren in clearScene()
		document.getElementById("simulationEngine").appendChild(this.renderer.domElement);
		
		this.stats = new Stats();
		this.stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom

		this.stats.dom.style.top = '';
		this.stats.dom.style.left = '';
		this.stats.dom.style.bottom = '0px';
		this.stats.dom.style.right = '0px';

		document.getElementById("simulationEngine").appendChild(this.stats.dom);
	}

	_clearRenderer() { 
		this.removeEventListeners();

		// remove these chidren in clearScene()
		document.getElementById("simulationEngine").removeChild(this.renderer.domElement);
		document.getElementById("simulationEngine").removeChild(this.stats.dom);

		this.Detector = undefined;
		this.renderer = undefined;
		this.stats = undefined;
	}

	_initializeCameraLightsControls() { 
		this._initializeCamera();
		this._initializeLights();
		this._initializeControls();
	}

	_initializeCamera() {
		if (!this.camera) { 
			// create a new camera
			this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000);

			// add camera to scene
			this.scene.add(this.camera);

			// set default position of camera or last camera position
			if (this.lastCameraPosition) { 
				this.camera.position.set(this.lastCameraPosition.x, this.lastCameraPosition.y, this.lastCameraPosition.z);
			} else { 
				this.camera.position.set(40, 40, 37);
			}

			// set the default orientation of the camera (which is the origin position of the scene)
			this.camera.lookAt(this.scene.position);
		}
	}

	_initializeLights() {
		if (!this.light) { 
			/* Lights */
			this.light = new THREE.DirectionalLight( 0xFFFFFF );
			this.light.position.set( 20, 20, -15 );
			this.light.target.position.copy( this.scene.position );
			this.light.castShadow = true;
			this.light.shadow.camera.left = -150;
			this.light.shadow.camera.top = -150;
			this.light.shadow.camera.right = 150;
			this.light.shadow.camera.bottom = 150;
			this.light.shadow.camera.near = 20;
			this.light.shadow.camera.far = 400;
			this.light.shadow.bias = -.0001;
			this.light.shadow.mapSize.width = this.light.shadow.mapSize.height = 2048;
			// this.light.shadowDarkness = .7;
			this.scene.add( this.light );
		}
	}

	_initializeControls(controlsId) {
		// TODO: implement rest of controls
		if (controlsId === 'orbit' || controlsId === undefined) {
			this.userControls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
			// controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
			this.userControls.enableDamping = true;
			this.userControls.dampingFactor = 0.25;
			this.userControls.enableZoom = true;
			this.userControls.zoomSpeed = 0.25;
			this.userControls.rotateSpeed = 0.25;
		} else if (controlsId === 'fly') {
			// TODO
		} else if (controlsId === 'pointer') { 
			// TODO
		}
	}

	render() {
		/* SIMULATION VIEW UPDATE LOGIC [START] */

		if (this.mainSceneInitialized === true && this.renderLoopActive === true) {
			this.stats.begin();
			
			// update the scene
			this.checkEvents();
			this.updateScene();
			this.userControls.update();

			// render the scene
			this.renderer.render(this.scene, this.camera); 
			
			this.stats.end();

			requestAnimationFrame(this.render.bind(this));
		}

		/* SIMULATION VIEW UPDATE LOGIC [END] */
	}

	startRenderLoop() {
		// initialize renderer
		// Note on this: the idea is not initialize the renderer independently of the scene.
		// initializing the renderer indep. Allows one to maintain the WebGL context after
		// clearing and reinitializing the scene, without having to create an entirely new
		// WebGL context when the scene is repurposed/reinitialized.
		// But currently dealing with a hard to find memory leak. Even after clearing the scene
		// and disposing of geometries, materials.
		// So the renderer is reinitialized here. 
		this._initializeRenderer();

		// <-- so that scene isn't re-created when user navigates back to simulator
		if (this.mainSceneInitialized === false) {
			// initialize scene (simulation view)
			this.initializeScene();
		}

		this._initializeCameraLightsControls();

debugger;

		if (this.mainSceneInitialized === true && this.renderLoopActive === false) {
			// start render loop
			this.renderLoopActive = true;
			this.render();
		}
	}

	stopRenderLoop() {
		if (this.mainSceneInitialized === true && this.renderLoopActive === true) {
			// set renderLoopActive flag to false 
			this.renderLoopActive = false;
		}
	}

	checkEvents() { 
		// TODO
	}

	updateScene() {
		this.lastCameraPosition = this.camera.position;
	}

	addEventListeners() {
		// Add window resize logic
		const onWindowResize = () => {
			this.renderer.setSize( window.innerWidth, window.innerHeight );
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
		};
		this.onWindowResize = onWindowResize.bind(this);
		window.addEventListener('resize', this.onWindowResize, false);
	}

	removeEventListeners() { 
		window.removeEventListener('resize', this.onWindowResize, false);
	}

	addAxis(AXIS_LENGTH) {
		// blue
		const xMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff});
		const xGeometry = new THREE.CubeGeometry(AXIS_LENGTH, 1, 1);
		const xAxis = new THREE.Mesh(xGeometry, xMaterial);
		xAxis.position.x += AXIS_LENGTH / 2;

		// red
		const yMaterial = new THREE.MeshBasicMaterial({color: 0xFF0000});
		const yGeometry = new THREE.CubeGeometry(1, AXIS_LENGTH, 1);
		const yAxis = new THREE.Mesh(yGeometry, yMaterial);
		yAxis.position.y += AXIS_LENGTH / 2;

		// green
		const zMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
		const zGeometry = new THREE.CubeGeometry(1, 1, AXIS_LENGTH);
		const zAxis = new THREE.Mesh(zGeometry, zMaterial);
		zAxis.position.z += AXIS_LENGTH / 2;

		this.scene.add(xAxis);
		this.scene.add(yAxis);
		this.scene.add(zAxis);
	}

	addCircle() {
		const material = new THREE.MeshBasicMaterial({
			color: 0x0000ff
		});

		const radius = 5;
		const segments = 32;

		const circleGeometry = new THREE.CircleGeometry( radius, segments );
		const circle = new THREE.Mesh( circleGeometry, material );
		// console.log(circle);
		this.scene.add( circle );
	}

	addGrid() {
		const size = 100, step = 1;
		const geometry = new THREE.Geometry();
		const material = new THREE.LineBasicMaterial( { color: 0x303030 } );
		for ( let i = - size; i <= size; i += step ) {
			geometry.vertices.push( new THREE.Vector3( - size, - 0.04, i ) );
			geometry.vertices.push( new THREE.Vector3( size, - 0.04, i ) );
			geometry.vertices.push( new THREE.Vector3( i, - 0.04, - size ) );
			geometry.vertices.push( new THREE.Vector3( i, - 0.04, size ) );
		}
		const line = new THREE.LineSegments( geometry, material );
		
		this.scene.add( line );
	}

	addGround() {
		// Ground

		/* Materials */
		const ground_material = new THREE.MeshLambertMaterial({ map: this.textureLoader.load( 'js/simulator/images/rocks.jpg' ) });
		ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
		ground_material.map.repeat.set( 3, 3 );

		const box_material = new THREE.MeshLambertMaterial({ map: this.textureLoader.load( 'js/simulator/images/plywood.jpg' ) });
		box_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
		box_material.map.repeat.set( .25, .25 );

		const ground_geometry = new THREE.PlaneGeometry(300, 300, 100, 100);
		for ( let i = 0; i < ground_geometry.vertices.length; i++ ) {
			// const vertex = ground_geometry.vertices[i];
			// vertex.y = NoiseGen.noise( vertex.x / 30, vertex.z / 30 ) * 1;
		}
		ground_geometry.computeFaceNormals();
		ground_geometry.computeVertexNormals();

		// If your plane is not square as far as face count then the HeightfieldMesh
		// takes two more arguments at the end: # of x faces and # of z faces that were passed to THREE.PlaneMaterial
		const ground = new THREE.Mesh(ground_geometry, ground_material);

		ground.rotation.x = -Math.PI / 2;
		ground.receiveShadow = true;
		this.scene.add( ground );

		for ( let i = 0; i < 50; i++ ) {
			const size = Math.random() * 2 + .5;
			const box = new THREE.Mesh(
				new THREE.BoxGeometry( size, size, size ),
				box_material
			);
			box.castShadow = box.receiveShadow = true;
			box.position.set(
				Math.random() * 25 - 50,
				5,
				Math.random() * 25 - 50
			);
			this.scene.add( box );
		}
	}

	addCube( size ) {
		const h = size * 0.5;
		const geometry = new THREE.Geometry();
		geometry.vertices.push(
			new THREE.Vector3( -h, -h, -h ),
			new THREE.Vector3( -h, h, -h ),
			new THREE.Vector3( -h, h, -h ),
			new THREE.Vector3( h, h, -h ),
			new THREE.Vector3( h, h, -h ),
			new THREE.Vector3( h, -h, -h ),
			new THREE.Vector3( h, -h, -h ),
			new THREE.Vector3( -h, -h, -h ),
			new THREE.Vector3( -h, -h, h ),
			new THREE.Vector3( -h, h, h ),
			new THREE.Vector3( -h, h, h ),
			new THREE.Vector3( h, h, h ),
			new THREE.Vector3( h, h, h ),
			new THREE.Vector3( h, -h, h ),
			new THREE.Vector3( h, -h, h ),
			new THREE.Vector3( -h, -h, h ),
			new THREE.Vector3( -h, -h, -h ),
			new THREE.Vector3( -h, -h, h ),
			new THREE.Vector3( -h, h, -h ),
			new THREE.Vector3( -h, h, h ),
			new THREE.Vector3( h, h, -h ),
			new THREE.Vector3( h, h, h ),
			new THREE.Vector3( h, -h, -h ),
			new THREE.Vector3( h, -h, h )
		);
		return geometry;
	}

	addElipse() { 
		const curve = new THREE.EllipseCurve(
			0, 0,             // ax, aY
			7, 15,            // xRadius, yRadius
			0, 3/2 * Math.PI, // aStartAngle, aEndAngle
			false             // aClockwise
		);

		const path = new THREE.Path( curve.getPoints( 50 ) );
		const geometry = path.createPointsGeometry( 50 );
		const material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

		// Create the final Object3d to add to the scene
		const ellipse = new THREE.Line( geometry, material );
		this.scene.add( ellipse );
	}
}
