/**
* Simulation color model accessible to all parts of the application and simulator
* 
* 
*/

// import * as THREE from 'three'
import * as _ from 'lodash';
import * as THREE from 'three';

var instance = null; 

class ColorModel { 
	constructor() { 
		if(!!!instance) { 
			this.nodeColors = {
				generalNodeColor: 0x83F52C, // lawn green
				actionNodeColor: 0xff6600, // orange
        		startNodeColor: 0xff69b4,   // pink
        		endNodeColor: 0x00e5ee     // turquoise
			}

			this.pathColors = { 
				generalPathColor: 0xff0000 // red
			}

			this.agentColors = { 
				mobileAgentColor: 0x83F52C // lawn green
			}

			instance = this;
		}
		return instance;		
	}
}

export default new ColorModel();