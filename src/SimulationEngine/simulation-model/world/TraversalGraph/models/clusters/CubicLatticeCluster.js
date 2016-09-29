import * as _ from 'lodash';
import * as THREE from 'three';
import Cluster from './Cluster'
import Node from '../../components/Node'

export default class CubicLatticeCluster extends Cluster {

    constructor(id, xNodes, yNodes, zNodes, edgeLength, position) {
        super();
        this.init(id, xNodes, yNodes, zNodes, edgeLength, position);
    } 

	init(id, xNodes, yNodes, zNodes, edgeLength, position) {

        if (!_.isInteger(edgeLength)) { throw new Error ( 'Segment width must be an integer.' )}

		this.id = id;
		this.body = new THREE.Object3D();			
		this.xNodes = xNodes;
		this.yNodes = yNodes;
		this.zNodes = zNodes;
		this.nodes = [];

		this.body.position.copy(position);
		
		// Build this.nodes
		for(var x = 0; x < xNodes; x++) {
            this.nodes.push([]);
            for(var y = 0; y < yNodes; y++) {
                this.nodes[x].push([]);
                for(var z = 0; z < zNodes; z++) {
                    this.nodes[x][y].push([]);


                    // IMPORTANT: Set position of Nodes in a Cluster as a function of the initial position 
                    // of the Cluster. Lanes are composed of a set of segments with a startNode and endNode
                    // from a particular Cluster. The vertices from each segment are combined to form the curve geometry 
                    // of the Lane.

                    // THIS IS THE PURPOSE OF CLUSTERS --> to define the position of Nodes, by which 
                    // Lanes can be built.

                    var position = new THREE.Vector3(
                    	(x * edgeLength), 
                    	(y * edgeLength), 
                    	(z * edgeLength));

                    var node = new Node("general", 0.5, position, x, y, z);

                    // Assign unique attributes to node
                    node.x = x;
                    node.y = y;
                    node.z = z;

                    this.nodes[x][y][z] = node;
                    this.body.add(node.body);
                }
            }
        }

        if (position) { this.body.position.copy(position) }
	}

	// Each extension of Cluster should have its own policies for the storage and retrieval of Nodes
	addNode(node, xIndex, yIndex, zIndex) {
		// Cubic lattic is pre-populated as of now
		// TODO 
		return false;
	} 

	// Each extension of Cluster should have its own policies for the storage and retrieval of Nodes
	removeNode(node) {
		// Cubic lattice is pre-populated as of now
		// Must also think about how paths are are affected downstream with the removal of a Node
		// TODO 
		return false;
	}

	// Each extension of Cluster should have its own policies for the retrieval of Nodes according to the
	// pathsModel hash convention
	getNode(nodeId) {
		// Sub clusters can be accessed here by modifying retrieval logic to retrieve nodes within sub clusters.
		// Sub clusters can be injected above.

		var nodeIdParams = nodeId.split("_");

		// check node id params for validity
		if (nodeIdParams.length == 4) {
			return this._getNodeByIndex(nodeIdParams[1], nodeIdParams[2], nodeIdParams[3]);
		} else {
			console.log("nodeId:");
			console.log(this); 
			throw new Error("CubicLattice cannot find node with nodeId");
		}
	}

	_getNodeByIndex(x, y, z) {
		if ( (x <= this.xNodes - 1 || x >= 0) && (y <= this.yNodes - 1 || y >= 0) && (z <= this.zNodes - 1 || z >= 0) ) {
			return this.nodes[x][y][z];
		} else {
			console.log(x);
			console.log(y);
			console.log(z);
			console.log("Lattice index out of bounds")
			throw new Error("Node index is out of bounds of Cubic Lattice");
		}
	}

	buildFlower(cx, cy, cz, nodeRadius) {
        var r = nodeRadius;

        var startNode = this._getNodeByIndex(cx, cy, cz);

        var endNode1 = this._getNodeByIndex(cx + r, cy + r, cz);
        var endNode2 = this._getNodeByIndex(cx, cy + r, cz + r);
        var endNode3 = this._getNodeByIndex(cx - r, cy + r, cz);
        var endNode4 = this._getNodeByIndex(cx, cy + r, cz - r);

        var endNode5 = this._getNodeByIndex(cx, cy - r, cz - r);
        var endNode6 = this._getNodeByIndex(cx - r, cy - r, cz);
        var endNode7 = this._getNodeByIndex(cx, cy - r, cz + r);
        var endNode8 = this._getNodeByIndex(cx + r, cy - r, cz);

        var endNode9 = this._getNodeByIndex(cx + r, cy, cz - r);
        var endNode10 = this._getNodeByIndex(cx + r, cy, cz + r);
        var endNode11  =this._getNodeByIndex(cx - r, cy, cz + r);
        var endNode12 = this._getNodeByIndex(cx - r, cy, cz - r);


        this.buildBend(startNode, endNode1, true, 100, true);
        this.buildBend(startNode, endNode2, true, 100, true);
        this.buildBend(startNode, endNode3, true, 100, true);
        this.buildBend(startNode, endNode4, true, 100, true);

        this.buildBend(startNode, endNode1, false, 100, true);
        this.buildBend(startNode, endNode2, false, 100, true);
        this.buildBend(startNode, endNode3, false, 100, true);
        this.buildBend(startNode, endNode4, false, 100, true);

        this.buildBend(startNode, endNode5, true, 100, true);
        this.buildBend(startNode, endNode6, true, 100, true);
        this.buildBend(startNode, endNode7, true, 100, true);
        this.buildBend(startNode, endNode8, true, 100, true);

        this.buildBend(startNode, endNode5, false, 100, true);
        this.buildBend(startNode, endNode6, false, 100, true);
        this.buildBend(startNode, endNode7, false, 100, true);
        this.buildBend(startNode, endNode8, false, 100, true);

        this.buildBend(startNode, endNode9, false, 100, true);
        this.buildBend(startNode, endNode10, false, 100, true);
        this.buildBend(startNode, endNode11, false, 100, true);
        this.buildBend(startNode, endNode12, false, 100, true);

        this.buildBend(startNode, endNode9, true, 100, true);
        this.buildBend(startNode, endNode10, true, 100, true);
        this.buildBend(startNode, endNode11, true, 100, true);
        this.buildBend(startNode, endNode12, true, 100, true);
    }
}