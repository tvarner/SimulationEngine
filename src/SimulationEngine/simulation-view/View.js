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
import * as _ from 'lodash'
import * as THREE from 'three'
import * as Detector from './utils/Detector'

// controls
import buildOrbitControls from './controls/OrbitControls'
import buildFlyControls from './controls/FlyControls'
import buildPointerLockControls from './controls/PointerLockControls'

// world config params
import * as ConfigParams from '../simulation-model/world/world_config_models/ConfigParams'
import * as LengthModel from '../simulation-model/world/world_config_models/LengthModel'
import * as TimeModel from '../simulation-model/world/world_config_models/TimeModel'
import VariableInterval from '../simulation-model/world/world_config_models/VariableInterval'

// utils: that cannot be imported as node modules
import PriorityQueue from 'js-priority-queue'

import Stats from 'stats.js'

export default class View { 

    constructor() {
        this.initialize();
    }

    // initialize View state
    initialize() {
        // Any View configuration prior to the loading of the scene is done here.
        this.renderLoopActive = false;
        this.mainSceneActivated = false;
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

        //  Texture Loader: load materials
        this.loader = new THREE.TextureLoader();

        // addEventListeners should be last scene init. function in initializeScene
        this.addEventListeners();
        
        document.getElementById("simulator").appendChild(this.renderer.domElement)
        
        this.stats = new Stats();
        this.stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom

        this.stats.dom.style.top = '';
        this.stats.dom.style.left = '';
        this.stats.dom.style.bottom = '0px';
        this.stats.dom.style.right = '0px';

        document.getElementById("simulator").appendChild( this.stats.dom );

    }

    _initializeCameraLightsControls() { 
        this.initializeCamera();
        this.initializeLights();
        this.initializeControls();
    }

    initializeScene() {
        if (this.mainSceneActivated === false) { 
            this.scene = new THREE.Scene;

            this._initializeCameraLightsControls()

            // add simulation view utils
            this.addAxis(30);
            this.addGrid();

            // set mainSceneActivated flag to true
            this.mainSceneActivated = true;
            this.renderLoopActive = false;
        }
    }

    render() {
/* SIMULATION VIEW UPDATE LOGIC [START] */
        if (this.mainSceneActivated === true) {
            this.checkEvents();
            this.updateScene();
            this._render();
            this.stats.update();
        }
/* SIMULATION VIEW UPDATE LOGIC [END] */
    }

    _render() {
        if (this.mainSceneActivated === true && this.renderLoopActive === true) { 
        
            this.stats.begin();
            this.userControls.update();
            this.renderer.render(this.scene, this.camera); // render the scene
            this.stats.end();

            requestAnimationFrame(this.render.bind(this));
        }
    }

    startRenderLoop() {
        this._initializeRenderer();

        if (this.mainSceneActivated === false) {    // <-- so that scene isn't re-created when user navigates back to simulator
            // initialize simulation view
            this.initializeScene();
        } else { 
            this._initializeCameraLightsControls();
        }

        if (this.mainSceneActivated === true && this.renderLoopActive === false) {

            console.log('STARTING RENDER LOOP [IN VIEW]')

            // set renderLoopActive flag to true
            this.renderLoopActive = true;

            // start render loop
            this.render();
        }
    }

    stopRenderLoop() {
        if (this.mainSceneActivated === true && this.renderLoopActive === true) {

            console.log('STOPPING RENDER LOOP [IN VIEW]')

            // set renderLoopActive flag to false 
            this.renderLoopActive = false;
        }
    }

    checkEvents() { 

    }

    updateScene() { 

    }

    initializeCamera() {
        var position = undefined;
        if (this.camera) { 
            position = this.camera.position.clone();
        }

        this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000);
        
        if (position !== undefined) { 
            this.camera.position.copy(position);
        } else { 
            this.camera.position.set(40, 40, 37);
        }

        this.camera.lookAt(this.scene.position);
        this.scene.add(this.camera);
    }

    initializeLights() {
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
        this.light.shadow.bias = -.0001
        this.light.shadow.mapSize.width = this.light.shadow.mapSize.height = 2048;
        //this.light.shadowDarkness = .7;
        this.scene.add( this.light );
    }

    initializeControls(controlsId) {
        // TODO: implement rest of controls 

        if (controlsId === 'orbit' || controlsId === undefined) { 
            buildOrbitControls(THREE);
            this.userControls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
            //controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
            this.userControls.enableDamping = true;
            this.userControls.dampingFactor = 0.25;
            this.userControls.enableZoom = true;
            this.userControls.zoomSpeed = 0.25;
            this.userControls.rotateSpeed = 0.25;
        } else if (controlsId === 'fly') { 
        } else if (controlsId === 'pointer') { 
        }
    }

    addEventListeners() {
        // Add window resize logic
        var onWindowResize = () => {
            this.renderer.setSize( window.innerWidth, window.innerHeight );
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        }
        this.onWindowResize = onWindowResize.bind(this);
        window.addEventListener( 'resize', this.onWindowResize, false );
    }

    addAxis(AXIS_LENGTH) {

        // blue
        var xMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff});
        var xGeometry = new THREE.CubeGeometry(AXIS_LENGTH, 1, 1);
        var xAxis = new THREE.Mesh(xGeometry, xMaterial);
        xAxis.position.x += AXIS_LENGTH / 2;

        // red
        var yMaterial = new THREE.MeshBasicMaterial({color: 0xFF0000});
        var yGeometry = new THREE.CubeGeometry(1, AXIS_LENGTH, 1);
        var yAxis = new THREE.Mesh(yGeometry, yMaterial);
        yAxis.position.y += AXIS_LENGTH / 2;

        // green
        var zMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
        var zGeometry = new THREE.CubeGeometry(1, 1, AXIS_LENGTH);
        var zAxis = new THREE.Mesh(zGeometry, zMaterial);
        zAxis.position.z += AXIS_LENGTH / 2;

        this.scene.add(xAxis);
        this.scene.add(yAxis);
        this.scene.add(zAxis);
    }

    addCircle() {
        var material = new THREE.MeshBasicMaterial({
            color: 0x0000ff
        });

        var radius = 5;
        var segments = 32;

        var circleGeometry = new THREE.CircleGeometry( radius, segments );
        var circle = new THREE.Mesh( circleGeometry, material );
        console.log(circle);
        this.scene.add( circle );
    }


    addGrid() {
        let size = 100, step = 1;
        let geometry = new THREE.Geometry();
        let material = new THREE.LineBasicMaterial( { color: 0x303030 } );
        for ( let i = - size; i <= size; i += step ) {
            geometry.vertices.push( new THREE.Vector3( - size, - 0.04, i ) );
            geometry.vertices.push( new THREE.Vector3(   size, - 0.04, i ) );
            geometry.vertices.push( new THREE.Vector3( i, - 0.04, - size ) );
            geometry.vertices.push( new THREE.Vector3( i, - 0.04,   size ) );
        }
        let line = new THREE.LineSegments( geometry, material );
        
        this.scene.add( line );
    }

    addGround() {
        // Ground

        /* Materials */
        var ground_material = new THREE.MeshLambertMaterial({ map: loader.load( 'js/simulator/images/rocks.jpg' ) });
        ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
        ground_material.map.repeat.set( 3, 3 );

        var box_material = new THREE.MeshLambertMaterial({ map: loader.load( 'js/simulator/images/plywood.jpg' ) });
        box_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
        box_material.map.repeat.set( .25, .25 );

        var ground_geometry = new THREE.PlaneGeometry(300, 300, 100, 100);
        for ( var i = 0; i < ground_geometry.vertices.length; i++ ) {
            var vertex = ground_geometry.vertices[i];
            //vertex.y = NoiseGen.noise( vertex.x / 30, vertex.z / 30 ) * 1;
        }
        ground_geometry.computeFaceNormals();
        ground_geometry.computeVertexNormals();

        // If your plane is not square as far as face count then the HeightfieldMesh
        // takes two more arguments at the end: # of x faces and # of z faces that were passed to THREE.PlaneMaterial
        ground = new THREE.Mesh(ground_geometry, ground_material);

        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add( ground );


        for ( i = 0; i < 50; i++ ) {
            var size = Math.random() * 2 + .5;
            var box = new THREE.Mesh(
                new THREE.BoxGeometry( size, size, size ),
                box_material
            );
            box.castShadow = box.receiveShadow = true;
            box.position.set(
                Math.random() * 25 - 50,
                5,
                Math.random() * 25 - 50
            );
            this.scene.add( box )
        }
    }

    addCube( size ) {
        var h = size * 0.5;
        var geometry = new THREE.Geometry();
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
        var curve = new THREE.EllipseCurve(
              0, 0,             // ax, aY
              7, 15,            // xRadius, yRadius
              0, 3/2 * Math.PI, // aStartAngle, aEndAngle
              false             // aClockwise
        );

        var path = new THREE.Path( curve.getPoints( 50 ) );
        var geometry = path.createPointsGeometry( 50 );
        var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

        // Create the final Object3d to add to the scene
        var ellipse = new THREE.Line( geometry, material );
        this.scene.add( ellipse );
    }
}