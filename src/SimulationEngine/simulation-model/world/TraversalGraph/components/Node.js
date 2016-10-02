/*
* Builds I/O node connecting lanes by Lanes
*/
// import * as _ from 'lodash';
import * as THREE from 'three';
import ColorModel from '../../world_config_models/ColorModel';

export default class Node { 
	constructor(type, radius, position, x, y, z) { 
		this.init(type, radius, position, x, y, z);
	}

	init(type, radius, position) {
		this.body = new THREE.Object3D();
		this.type;
		this.buildBody(radius, position);
	}

	buildBody(radius, position) {
		if (this.type === "general" || this.type === undefined) {
			const geometry = new THREE.SphereGeometry(radius, 32, 32);
			const material = new THREE.MeshBasicMaterial( {color: ColorModel.nodeColors.generalNodeColor, wireframe: true} ); // LAWN GREEN
			const bodyMesh = new THREE.Mesh( geometry, material );

			this.body.add(bodyMesh);
			this.body.mesh = bodyMesh;

			this.body.position.x = position.x;
			this.body.position.y = position.y;
			this.body.position.z = position.z;
		} else if (this.type === "action") {
			const geometry = new THREE.SphereGeometry(radius, 32, 32);
			const material = new THREE.MeshBasicMaterial( {color: ColorModel.nodeColors.actionNodeColor, wireframe: true} ); // ORANGE
			const bodyMesh = new THREE.Mesh( geometry, material );

			this.body = new THREE.Object3D();
			this.body.add(bodyMesh);
			this.body.mesh = bodyMesh;

			this.body.position.x = position.x;
			this.body.position.y = position.y;
			this.body.position.z = position.z;                  
		}
	}

	setColor(color) { // <-- THREE.Color
		this.body.mesh.material.color = new THREE.Color(color);
	}
}