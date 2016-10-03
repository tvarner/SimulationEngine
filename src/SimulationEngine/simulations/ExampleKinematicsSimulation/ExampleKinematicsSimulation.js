// TODO create Simulation Object here
// reference deps to Engine and State Space and TraversalGraph

// general utils
import * as _ from 'lodash';
import * as THREE from 'three';

// world config models
import TimeModel from '../../simulation-model/world/world_config_models/TimeModel';
import LengthModel from '../../simulation-model/world/world_config_models/LengthModel';
import ColorModel from '../../simulation-model/world/world_config_models/ColorModel';
// import ConfigParams from '../../simulation-model/world/world_config_models/ConfigParams';

// view utils
import dat from '../../utils/dat/index';

// general utils
import Fullik from '../../simulation-model/world/Fullik/Fullik';

// import TWEEN from 'tween';

const Simulation = { 
	name: "Example Kinematics Simulation",
	colorModel: ColorModel,
	lengthModel: new LengthModel(),
	timeModel: new TimeModel(),
	defaultSystemTimeLimit: 60, // <-- in seconds

	initializeModel: function(stateSpace) {

		this.stateSpace = stateSpace

		// initiate model
		this.stateSpace.systemTime = 0.0; 
/*
		this.stateSpace.view.colladaLoader.options.convertUpAxis = true;
		
		const colladaUrl = require('file!./models/kawada-hironx.dae');

		const colladaLoaderFn = function(collada) { 
			this.dae = collada.scene;
			this.dae.traverse( function ( child ) {
				if ( child instanceof THREE.Mesh ) {
					child.geometry.computeFaceNormals();
					child.material.shading = THREE.FlatShading;
				}
			});
			this.dae.scale.x = this.dae.scale.y = this.dae.scale.z = 10.0;
			this.dae.updateMatrix();
			this.kinematics = collada.kinematics;
			this.tweenParameters = {};

			// init();
			this.stateSpace.view.scene.add(this.dae);
			this.setupTween();

			// animate();
			debugger;
		};

		this.stateSpace.view.colladaLoader.load( colladaUrl, colladaLoaderFn.bind(this));
*/
		// Fullik
		this.box = []
		this.targets = [];
		this.setting = {
			fixed: true
		};
		this.X_AXIS = new Fullik.V3( 1, 0, 0 );
		this.Y_AXIS = new Fullik.V3( 0, 1, 0 );
		this.Z_AXIS = new Fullik.V3( 0, 0, 1 );
		this.defaultBoneDirection = this.Z_AXIS.negated();
		this.defaultBoneLength = 10;
		this.solver = new Fullik.Structure( this.stateSpace.view.scene );

		this.state = { 
			animateBones: false
		}

		this.demo(0);
	},

	initializeControls: function(stateSpace) {
		const that = this;
		stateSpace.view.controls = new function() { 
			this.openDemo0 = function(v) { that.demo(0) };
			this.openDemo1 = function(v) { that.demo(1) };
			this.openDemo2 = function(v) { that.demo(2) };
			this.openDemo3 = function(v) { that.demo(3) };
			this.openDemo4 = function(v) { that.demo(4) };
			this.openDemo5 = function(v) { that.demo(5) };
			this.openDemo6 = function(v) { that.demo(6) };
			this.openDemo7 = function(v) { that.demo(7) };
			this.openDemo8 = function(v) { that.demo(8) };
			this.openDemo9 = function(v) { that.demo(9) };
			this.openDemo10 = function(v) { that.demo(10) };
			this.openDemo11 = function(v) { that.demo(11) };
			this.openDemo12 = function(v) { that.demo(12) };
			this.setFixedBaseMode = function(v) {
				that.solver.setFixedBaseMode(v); 
				that.solver.update(); 
			}
		}

		stateSpace.view.gui = new dat.gui.GUI();
		const kinematicModelsFolder = stateSpace.view.gui.addFolder('Kinematic Models');

		// stateSpace.view.gui.add('title', { name:'FULL IK', prefix:0.1, h:30, r:10 } );
		kinematicModelsFolder.add(stateSpace.view.controls, 'openDemo0');
		kinematicModelsFolder.add(stateSpace.view.controls, 'openDemo1');
		kinematicModelsFolder.add(stateSpace.view.controls, 'openDemo2');
		kinematicModelsFolder.add(stateSpace.view.controls, 'openDemo3');
		kinematicModelsFolder.add(stateSpace.view.controls, 'openDemo4');
		kinematicModelsFolder.add(stateSpace.view.controls, 'openDemo5');
		kinematicModelsFolder.add(stateSpace.view.controls, 'openDemo6');
		kinematicModelsFolder.add(stateSpace.view.controls, 'openDemo7');
		kinematicModelsFolder.add(stateSpace.view.controls, 'openDemo8');
		kinematicModelsFolder.add(stateSpace.view.controls, 'openDemo9');
		kinematicModelsFolder.add(stateSpace.view.controls, 'openDemo10');
		kinematicModelsFolder.add(stateSpace.view.controls, 'openDemo11');
		kinematicModelsFolder.add(stateSpace.view.controls, 'openDemo12');
		kinematicModelsFolder.add(stateSpace.view.controls, 'setFixedBaseMode');
	},

	updateStateSpace: function(t, stateSpace) {
		/*
		TWEEN.update();
		*/
	},

	updateControls: function(stateSpace) { 

	},

    updateSolver: function() {
        this.solver.update();
    },

	addTarget: function(position) {
		var n = {
			mesh : new THREE.Mesh( new THREE.SphereBufferGeometry( 0.75 ),  new THREE.MeshStandardMaterial({color:0xFFFFFF, wireframe:true }) ),
			control : new THREE.TransformControls( this.stateSpace.view.camera, this.stateSpace.view.renderer.domElement ),
		}
		this.stateSpace.view.scene.add( n.mesh );
		n.mesh.position.copy(position);
		n.control.addEventListener( 'change', this.updateSolver.bind(this) );
		n.control.attach( n.mesh );
		n.control.setSize(0.75);
		this.stateSpace.view.scene.add( n.control );
		n.position = n.mesh.position;
		this.targets.push(n);
	},

	clearAllTargets: function() {
		var n;
		for(var i = 0; i < this.targets.length; i++ ){
			n = this.targets[i];
			n.control.detach( n.mesh );
			this.stateSpace.view.scene.remove(n.mesh);
			n.control.removeEventListener( 'change', this.updateSolver.bind(this) );
			this.stateSpace.view.scene.remove(n.control);
		}
		this.targets = [];
	},

	demo: function(n) { 
		this.clearAllTargets();
		this.solver.clear();
		// add basic target
		this.addTarget( new THREE.Vector3(0, 30, 0) );
		let target = this.targets[0].position;

		switch( n ) {
			case 0:
			// tell("Demo 0 - Human bones");
			this.addTarget(new THREE.Vector3(-30, 15, 0));
			this.addTarget(new THREE.Vector3(30, 15, 0));
			this.addTarget(new THREE.Vector3(-8, -40, 0));
			this.addTarget(new THREE.Vector3( 8, -40, 0));
			var startLoc = new Fullik.V3();
			var chain, basebone;
			// 0 spine
			chain = new Fullik.Chain( 0xFFFF00 );
			basebone = new Fullik.Bone( startLoc, new Fullik.V3( 0, 2, 0 ) );
			chain.addBone( basebone );
			chain.addConsecutiveRotorConstrainedBone( this.Y_AXIS, 5, 30 );
			chain.addConsecutiveRotorConstrainedBone( this.Y_AXIS, 5, 30 );
			chain.addConsecutiveRotorConstrainedBone( this.Y_AXIS, 5, 30 );
			chain.addConsecutiveRotorConstrainedBone( this.Y_AXIS, 5, 30 );
			this.solver.add( chain, this.targets[0].position, true );
			// 1 left arm
			chain = new Fullik.Chain();
			basebone = new Fullik.Bone( new Fullik.V3( 0, 20, 0 ), new Fullik.V3( -5, 20, 0 ) );
			chain.addBone( basebone );
			chain.addConsecutiveRotorConstrainedBone( this.X_AXIS.negated(), 10, 90 );
			chain.addConsecutiveHingedBone( this.X_AXIS.negated(), 10, 'global', this.Y_AXIS, 90, 120, this.X_AXIS.negated() );
			//chain.addConsecutiveHingedBone( this.X_AXIS.negated(), 10, Fullik.J_GLOBAL_HINGE, this.Y_AXIS, 90, 90, this.Z_AXIS );
			//chain.addConsecutiveBone( this.X_AXIS.negated(), 10 );
			//chain.addConsecutiveBone( this.X_AXIS.negated(), 10 );
			//chain.addConsecutiveBone( this.X_AXIS.negated(), 5 );
			chain.setRotorBaseboneConstraint( 'local', this.X_AXIS.negated(), 10 );
			this.solver.connectChain( chain, 0, 3, 'end', this.targets[1].position, true, 0x44FF44 );
			// 2 right arm
			chain = new Fullik.Chain();
			basebone = new Fullik.Bone( new Fullik.V3( 0, 20, 0 ), new Fullik.V3( -5, 20, 0 ) );
			chain.addBone( basebone );
			chain.addConsecutiveRotorConstrainedBone( this.X_AXIS, 10, 90 );
			chain.addConsecutiveHingedBone( this.X_AXIS.negated(), 10, 'global', this.Y_AXIS, 90, 120, this.X_AXIS );
			//chain.addConsecutiveBone( this.X_AXIS, 10 );
			//chain.addConsecutiveBone( this.X_AXIS, 10 );
			//chain.addConsecutiveBone( this.X_AXIS, 5 );
			chain.setRotorBaseboneConstraint( 'local', this.X_AXIS, 10 );
			this.solver.connectChain( chain, 0, 3, 'end', this.targets[2].position, true, 0x4444FF );
			// 5 left leg
			chain = new Fullik.Chain();
			basebone = new Fullik.Bone( new Fullik.V3( 0, 0, 0 ), new Fullik.V3( -4, 0, 0 ) );
			chain.addBone( basebone );
			chain.addConsecutiveRotorConstrainedBone( this.Y_AXIS.negated(), 15, 90 );
			chain.addConsecutiveHingedBone( this.Y_AXIS.negated(), 15, 'local', this.Y_AXIS, 1, 120, this.Z_AXIS );
			//chain.addConsecutiveBone( this.Y_AXIS.negated(), 15 );
			//chain.addConsecutiveBone( this.Y_AXIS.negated(), 15  );
			chain.setRotorBaseboneConstraint( 'local', this.X_AXIS.negated(), 10 );
			this.solver.connectChain( chain, 0, 0, 'start', this.targets[3].position, true, 0x44FF44 );
			// 5 left right
			chain = new Fullik.Chain();
			basebone = new Fullik.Bone( new Fullik.V3( 0, 0, 0 ), new Fullik.V3( 4, 0, 0 ) );
			chain.addBone( basebone );
			chain.addConsecutiveRotorConstrainedBone( this.Y_AXIS.negated(), 15, 90 );
			chain.addConsecutiveHingedBone( this.Y_AXIS.negated(), 15, 'local', this.Z_AXIS.negated(), 1, 120, this.Z_AXIS.negated() );
			//chain.addConsecutiveBone( this.Y_AXIS.negated(), 15 );
			//chain.addConsecutiveBone( this.Y_AXIS.negated(), 15  );
			chain.setRotorBaseboneConstraint( 'local', this.X_AXIS, 10 );
			this.solver.connectChain( chain, 0, 0, 'start', this.targets[4].position, true, 0x4444FF );
			break;

			case 1:
			// tell("Demo 1 - Unconstrained bones");
			var numChains = 20;
			for( var i=0; i<numChains; i++ ){
				var chain = new Fullik.Chain( 0x999999 );
				var startLoc = new Fullik.V3(-40+(i*4),0,40);
				var endLoc = startLoc.plus( this.defaultBoneDirection.times(this.defaultBoneLength));
				var basebone = new Fullik.Bone( startLoc, endLoc );
				chain.addBone( basebone );
				for (var j = 0; j < 7; j++) {
				    chain.addConsecutiveBone( this.defaultBoneDirection, this.defaultBoneLength );
				};
				this.solver.add( chain, target, true );
			}
			break;

			case 2:
			// tell("Demo 2 - Rotor / Ball Joint Constrained Bones");
			var numChains = 3;
			var rotStep = 360 / numChains;
			var constraintAngleDegs = 45;
			var color = 0xFF0000;
			for (var i = 0; i < numChains; i++ ){
			    switch (i){
			        case 0: color = 0x550000;   break;
			        case 1: color = 0x005500; break;
			        case 2: color = 0x000055;  break;
			    }
			    var chain = new Fullik.Chain( color )
			    var startLoc = new Fullik.V3(0, 0, -40);
			    startLoc = Fullik.rotateYDegs( startLoc, rotStep * i );
			    var endLoc = startLoc.clone();
			    endLoc.z -= this.defaultBoneLength;
			    var basebone = new Fullik.Bone( startLoc, endLoc );
			    chain.addBone( basebone );
			    for (var j = 0; j < 7; j++) {
			        chain.addConsecutiveRotorConstrainedBone( this.defaultBoneDirection, this.defaultBoneLength, constraintAngleDegs );
			    };
			    this.solver.add( chain, target, true );
			}
			break;

			case 3:
			// tell("Demo 3 - Rotor Constrained Base Bones");
			var numChains = 3;
			var rotStep = 360 / numChains;
			var baseBoneConstraintAngleDegs = 20;
			var baseBoneConstraintAxis;
			var color = 0xFF0000;
			for (var i = 0; i < numChains; i++ ){
			    switch (i){
			        case 0: color = 0xFF0000; baseBoneConstraintAxis = this.X_AXIS;  break;
			        case 1: color = 0x00FF00; baseBoneConstraintAxis = this.Y_AXIS;  break;
			        case 2: color = 0x0000FF; baseBoneConstraintAxis = this.Z_AXIS.negated();  break;
			    }
			    var chain = new Fullik.Chain( color );
			    var startLoc = new Fullik.V3(0, 0, -40);
			    startLoc = Fullik.rotateYDegs( startLoc, rotStep * i );
			    var endLoc = startLoc.plus( this.defaultBoneDirection.times(this.defaultBoneLength * 2));
			    //endLoc.z -= this.defaultBoneLength;
			    var basebone = new Fullik.Bone( startLoc, endLoc );
			    chain.addBone( basebone );
			    chain.setRotorBaseboneConstraint( 'global', baseBoneConstraintAxis, baseBoneConstraintAngleDegs);
			    for (var j = 0; j < 7; j++) {
			        chain.addConsecutiveBone( this.defaultBoneDirection, this.defaultBoneLength );
			    };
			    this.solver.add( chain, target, true );
			}
			break;

			case 4:
			// tell("Demo 4 - Freely Rotating Global Hinges");
			var numChains = 3;
			var rotStep = 360 / numChains;
			var baseBoneConstraintAngleDegs = 20;
			var globalHingeAxis;
			var color = 0xFF0000;
			for (var i = 0; i < numChains; i++ ){
			    switch (i){
			        case 0: color = 0xFF0000; globalHingeAxis = this.X_AXIS;  break;
			        case 1: color = 0x00FF00; globalHingeAxis = this.Y_AXIS;  break;
			        case 2: color = 0x0000FF; globalHingeAxis = this.Z_AXIS;  break;
			    }
			    var chain = new Fullik.Chain( color );
			    var startLoc = new Fullik.V3(0, 0, -40);
			    startLoc = Fullik.rotateYDegs( startLoc, rotStep * i );
			    var endLoc = startLoc.plus( this.defaultBoneDirection.times(this.defaultBoneLength));
			    var basebone = new Fullik.Bone( startLoc, endLoc );
			    chain.addBone( basebone );
			    for (var j = 0; j < 7; j++) {
			        if (j % 2 == 0) chain.addConsecutiveFreelyRotatingHingedBone( this.defaultBoneDirection, this.defaultBoneLength, 'global', globalHingeAxis );
			        else chain.addConsecutiveBone( this.defaultBoneDirection, this.defaultBoneLength );
			    };
			    this.solver.add( chain, target, true );
			}
			break;

			case 5:
			// tell("Demo 5 - Global Hinges With Reference Axis Constraints");
			var chain = new Fullik.Chain( 0x999999 );
			var startLoc = new Fullik.V3( 0, 30, -40 );
			var endLoc = startLoc.clone();
			endLoc.z -= this.defaultBoneLength;
			var basebone = new Fullik.Bone( startLoc, endLoc );
			chain.addBone( basebone );
			for (var j = 0; j < 8; j++) {
			    if (j % 2 == 0) chain.addConsecutiveHingedBone( this.Y_AXIS.negated(), this.defaultBoneLength, 'global', this.Z_AXIS, 120, 120, this.Y_AXIS.negated() );
			    else chain.addConsecutiveBone( this.Y_AXIS.negated(), this.defaultBoneLength )
			};
			this.solver.add( chain, target, true );
			break;

			case 6:
			// tell("Demo 6 - Freely Rotating Local Hinges");
			var numChains = 3;
			var rotStep = 360 / numChains;
			var baseBoneConstraintAngleDegs = 20;
			var hingeRotationAxis;
			var color = 0xFF0000;
			for (var i = 0; i < numChains; i++ ){
			    switch (i){
			        case 0: color = 0xFF0000; hingeRotationAxis = this.X_AXIS; break;
			        case 1: color = 0x00FF00; hingeRotationAxis = this.Y_AXIS; break;
			        case 2: color = 0x0000FF; hingeRotationAxis = this.Z_AXIS; break;
			    }
			    var chain = new Fullik.Chain( color );
			    var startLoc = new Fullik.V3(0, 0, -40);
			    startLoc = Fullik.rotateYDegs( startLoc, rotStep * i );
			    var endLoc = startLoc.plus( this.defaultBoneDirection.times(this.defaultBoneLength));
			    var basebone = new Fullik.Bone( startLoc, endLoc );
			    chain.addBone( basebone );
			    for (var j = 0; j < 7; j++) {
			        if (j % 2 == 0) chain.addConsecutiveFreelyRotatingHingedBone( this.defaultBoneDirection, this.defaultBoneLength, 'local', hingeRotationAxis );
			        else chain.addConsecutiveBone( this.defaultBoneDirection, this.defaultBoneLength );
			    };
			    this.solver.add( chain, target, true );
			}
			break;

			case 7:
			// tell("Demo 7 - Local Hinges with Reference Axis Constraints");
			var numChains = 3;
			var rotStep = 360 / numChains;
			var baseBoneConstraintAngleDegs = 20;
			var hingeRotationAxis;
			var hingeReferenceAxis;
			var color = 0xFF0000;
			for (var i = 0; i < numChains; i++ ){
			    switch (i){
			        case 0: color = 0xFF0000; hingeRotationAxis = this.X_AXIS; hingeReferenceAxis = this.Y_AXIS; break;
			        case 1: color = 0x00FF00; hingeRotationAxis = this.Y_AXIS; hingeReferenceAxis = this.X_AXIS; break;
			        case 2: color = 0x0000FF; hingeRotationAxis = this.Z_AXIS; hingeReferenceAxis = this.Y_AXIS; break;
			    }
			    var chain = new Fullik.Chain( color );
			    var startLoc = new Fullik.V3(0, 0, -40);
			    startLoc = Fullik.rotateYDegs( startLoc, rotStep * i );
			    var endLoc = startLoc.plus( this.defaultBoneDirection.times(this.defaultBoneLength));
			    var basebone = new Fullik.Bone( startLoc, endLoc );
			    chain.addBone( basebone );
			    for (var j = 0; j < 6; j++) {
			        if (j % 2 == 0) chain.addConsecutiveHingedBone( this.defaultBoneDirection, this.defaultBoneLength, 'local', hingeReferenceAxis, 90, 90, hingeReferenceAxis );
			        
			        else chain.addConsecutiveBone( this.defaultBoneDirection, this.defaultBoneLength );
			    };
			    this.solver.add( chain, target, true );
			}
			break;

			case 8:
			// tell("Demo 8 - Connected Chains");
			var chain = new Fullik.Chain( 0x999999 );
			var startLoc = new Fullik.V3( 0, 0, 40 );
			var endLoc = startLoc.plus( this.defaultBoneDirection.times(this.defaultBoneLength) );
			var basebone = new Fullik.Bone( startLoc, endLoc );
			chain.addBone( basebone );
			for (var j = 0; j < 8; j++) {
			    chain.addConsecutiveBone( this.defaultBoneDirection, this.defaultBoneLength );
			};
			this.solver.add( chain, target, true );
			var chain2 = new Fullik.Chain( 0xFF9999 );
			var base = new Fullik.Bone( new Fullik.V3(100, 0, 0), new Fullik.V3(110, 0, 0) );
			chain2.addBone(base);
			chain2.addConsecutiveBone( this.X_AXIS, 20 );
			chain2.addConsecutiveBone( this.Y_AXIS, 20 );
			chain2.addConsecutiveBone( this.Z_AXIS, 20 );
			this.solver.connectChain( chain2, 0, 0, 'start', target, true, 0xFF0000 );
			this.solver.connectChain( chain2, 0, 2, 'start', target, true, 0x00FF00 );
			this.solver.connectChain( chain2, 0, 4, 'end'  , target, true, 0x0000FF );
			break;

			case 9:
			// tell("Demo 9 - Global Rotor Constrained Connected Chains");
			var chain = new Fullik.Chain( 0x999999 );
			var startLoc = new Fullik.V3(0, 0, 40);
			var endLoc = startLoc.plus( this.defaultBoneDirection.times(this.defaultBoneLength) );
			var basebone = new Fullik.Bone( startLoc, endLoc );
			chain.addBone( basebone );
			for (var j = 0; j < 7; j++) {
			    chain.addConsecutiveBone( this.defaultBoneDirection, this.defaultBoneLength );
			};
			this.solver.add( chain, target, true );
			var chain2 = new Fullik.Chain();
			var base = new Fullik.Bone( new Fullik.V3(0, 0, 0), new Fullik.V3(15, 0, 0) );
			chain2.addBone(base);
			chain2.setRotorBaseboneConstraint( 'global', this.X_AXIS, 45);
			chain2.addConsecutiveBone( this.X_AXIS, 15 );
			chain2.addConsecutiveBone( this.X_AXIS, 15 );
			chain2.addConsecutiveBone( this.X_AXIS, 15 );
			this.solver.connectChain( chain2, 0, 3, 'start', target, true, 0xFF0000 );
			var chain3 = new Fullik.Chain();
			var base = new Fullik.Bone( new Fullik.V3(0, 0, 0), new Fullik.V3(0, 15, 0) );
			chain3.addBone(base);
			chain3.setRotorBaseboneConstraint( 'global', this.Y_AXIS, 45);
			chain3.addConsecutiveBone( this.Y_AXIS, 15 );
			chain3.addConsecutiveBone( this.Y_AXIS, 15 );
			chain3.addConsecutiveBone( this.Y_AXIS, 15 );
			this.solver.connectChain( chain3, 0, 6, 'start', target, true, 0x00FF00 );
			break;

			case 10:
			// tell("Demo 10 - Local Rotor Constrained Connected Chains");
			this.addTarget(new THREE.Vector3(20, 20, 20))
			var chain = new Fullik.Chain( 0x999999 );
			var startLoc = new Fullik.V3(0, 0, 40);
			var endLoc = startLoc.plus( this.defaultBoneDirection.times(this.defaultBoneLength) );
			var basebone = new Fullik.Bone( startLoc, endLoc );
			chain.addBone( basebone );
			for (var j = 0; j < 7; j++) {
			    chain.addConsecutiveBone( this.defaultBoneDirection, this.defaultBoneLength );
			};
			this.solver.add( chain, target, true );
			var chain2 = new Fullik.Chain();
			var base = new Fullik.Bone( new Fullik.V3(0, 0, 0), new Fullik.V3(15, 0, 0) );
			chain2.addBone(base);

			chain2.setRotorBaseboneConstraint( 'local', this.X_AXIS, 45 );
			chain2.addConsecutiveBone( this.X_AXIS, 15 );
			chain2.addConsecutiveBone( this.X_AXIS, 15 );
			chain2.addConsecutiveBone( this.X_AXIS, 15 );
			this.solver.connectChain( chain2, 0, 3, 'start', this.targets[1].position, true, 0xFF0000 );
			break;

			case 11:
			// tell("Demo 11 - Connected Chains with Freely-Rotating Global Hinged Basebone Constraints");
			this.addTarget(new THREE.Vector3(20, 20, 20))
			var chain = new Fullik.Chain( 0x999999 );
			var startLoc = new Fullik.V3(0, 0, 40);
			var endLoc = startLoc.plus( this.defaultBoneDirection.times(this.defaultBoneLength) );
			var basebone = new Fullik.Bone( startLoc, endLoc );
			chain.addBone( basebone );
			for (var j = 0; j < 7; j++) {
			    chain.addConsecutiveBone( this.defaultBoneDirection, this.defaultBoneLength );
			};
			this.solver.add( chain, target, true );
			var chain2 = new Fullik.Chain();
			var base = new Fullik.Bone( new Fullik.V3(0, 0, 0), new Fullik.V3(15, 0, 0) );
			chain2.addBone(base);
			// Set this second chain to have a freely rotating global hinge which rotates about the Y axis
			// Note: We MUST add the basebone to the chain before we can set the basebone constraint on it.
			chain2.setFreelyRotatingGlobalHingedBasebone( this.Y_AXIS );
			chain2.addConsecutiveBone( this.X_AXIS, 15 );
			chain2.addConsecutiveBone( this.X_AXIS, 15 );
			chain2.addConsecutiveBone( this.X_AXIS, 15 );
			this.solver.connectChain( chain2, 0, 3, 'start', this.targets[1].position, true, 0xFF0000 );
			break;

			case 12:
			// tell("Demo 12 - Connected Chains with Non-Freely-Rotating Global Hinge Basebone Constraints");
			this.addTarget(new THREE.Vector3(20, 20, 20))
			var chain = new Fullik.Chain( 0x999999 );
			var startLoc = new Fullik.V3(0, 0, 40);
			var endLoc = startLoc.plus( this.defaultBoneDirection.times(this.defaultBoneLength) );
			var basebone = new Fullik.Bone( startLoc, endLoc );
			chain.addBone( basebone );
			for (var j = 0; j < 7; j++) {
			    chain.addConsecutiveBone( this.defaultBoneDirection, this.defaultBoneLength );
			};
			this.solver.add( chain, target, true );
			var chain2 = new Fullik.Chain();
			var base = new Fullik.Bone( new Fullik.V3(0, 0, 0), new Fullik.V3(15, 0, 0) );
			chain2.addBone(base);
			chain2.setHingeBaseboneConstraint( 'global', this.Y_AXIS, 90, 45, this.X_AXIS);
			chain2.addConsecutiveBone( this.X_AXIS, 15 );
			chain2.addConsecutiveBone( this.X_AXIS, 10 );
			chain2.addConsecutiveBone( this.X_AXIS, 10 );
			this.solver.connectChain( chain2, 0, 3, 'start', this.targets[1].position, true, 0xFF0000 );
			break;
		}

		this.updateSolver();
	}

	/*
	setupTween: function() {
		const duration = this.getRandomInt( 1000, 5000 );
		const target = {};
		for ( let i = 0; i < this.kinematics.joints.length; i ++ ) {
			const joint = this.kinematics.joints[ i ];
			const old = this.tweenParameters[ i ];
			const position = old ? old : joint.zeroPosition;
			this.tweenParameters[ i ] = position;

			target[ i ] = this.getRandomInt( joint.limits.min, joint.limits.max );
		}
		this.kinematicsTween = new TWEEN.Tween( this.tweenParameters ).to( target, duration ).easing( TWEEN.Easing.Quadratic.Out );
		
		const tweenKinematicsUpdateFn = function() {
			for ( let i = 0; i < this.kinematics.joints.length; i ++ ) {
				this.kinematics.setJointValue( i, this[ i ] );
			}
		}

		this.kinematicsTween.onUpdate( tweenKinematicsUpdateFn.bind(this) );

		this.kinematicsTween.start();
		setTimeout( this.setupTween.bind(this), duration );
	},

	getRandomInt: function( min, max ) {
		return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
	}
	*/
};

export default Simulation;