// TODO create Simulation Object here
// reference deps to Engine and State Space and TraversalGraph

// general utils
// import * as _ from 'lodash';
import * as THREE from 'three';

// world config models
import TimeModel from '../../simulation-model/world/world_config_models/TimeModel';
import LengthModel from '../../simulation-model/world/world_config_models/LengthModel';
import ColorModel from '../../simulation-model/world/world_config_models/ColorModel';
// import ConfigParams from '../../simulation-model/world/world_config_models/ConfigParams';

// view utils
// import dat from '../../utils/dat/index';

// general utils
import TWEEN from 'tween';

const ExampleColladaSimulation = function() { 
	this.name = "Example Kinematics Simulation"; 
	this.colorModel = ColorModel;
	this.lengthModel = new LengthModel() ;
	this.timeModel = new TimeModel();
	this.defaultSystemTimeLimit = 60; // <-- in seconds
};


ExampleColladaSimulation.prototype = { 
	initializeModel: function(stateSpace) {
		this.stateSpace = stateSpace;

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
		};

		this.stateSpace.view.colladaLoader.load( colladaUrl, colladaLoaderFn.bind(this));
	},

	initializeControls: function(/* stateSpace */) {},

	updateStateSpace: function(/* t, stateSpace */) {
		this.kinematicsTween.update();
	},

	updateControls: function(/* stateSpace */) {},

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
		};

		this.kinematicsTween.onUpdate( tweenKinematicsUpdateFn.bind(this) );

		this.kinematicsTween.start();
		setTimeout( this.setupTween.bind(this), duration );
	},

	getRandomInt: function( min, max ) {
		return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
	}
};

export default ExampleColladaSimulation;