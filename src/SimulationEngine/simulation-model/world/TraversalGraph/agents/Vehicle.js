import MobileAgent from './MobileAgent'

export default class Vehicle extends MobileAgent { 
	constructor(id, traversalGraph) { 
		super(id, traversalGraph);
		this.initVehicle();	
	}

	initVehicle() {}
}