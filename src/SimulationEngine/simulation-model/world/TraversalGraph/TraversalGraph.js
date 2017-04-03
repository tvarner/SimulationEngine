/**

http://mathworld.wolfram.com/CubicLattice.html

A cubic lattice of coordinate points that describes the possible set of destination
and end points for lanes in Traversal Space.

This is used to characterize the physical layout of road systems [lanes, and intersections]
for their easy and rapid construction.

Road systems can be customized and constructed using a finite set of curve segments
of a particular type/shape that describe lanes.

Intersections can also be defined as the [rectangular] volumetric space that envelops
intersection entry and exit points that are also contained within the lattice.

*/
import * as _ from 'lodash';
import * as THREE from 'three';
import LengthModel from '../world_config_models/LengthModel';
import ColorModel from '../world_config_models/ColorModel';
import Lane from './components/Lane';
import MobileAgent from './agents/MobileAgent';
// import Node from './components/Node';
// import Intersection from './components/Intersection';

export default class TraversalGraph {
	constructor(pathsModel) {
		this.init(pathsModel);
	}

	init(pathsModel) {
		this.lengthModel = new LengthModel();
		this.IOPoints;
		this.edgeLength; // <-- MUST BE AN INTEGER --> b/c agent positions are autocorrected at integer component values (with precision up to multiples of 1/8)
		this.lanes = [];
		this.nodes = [];
		this.intersectionVertices = [];
		this.pathPositionsHashMap = {};
		this.mobileAgents = [];
		this.laneTransitions = [];
		this.body = new THREE.Object3D();

		if (pathsModel) { 
			this.buildPathsModel(pathsModel);
		} else { 
			throw new Error('TraversalGraph must be initiated with a valid pathsModel');
		}
	}

	buildPathsModel(pathsModel) {
		if (pathsModel) { 
			this.pathsModel = pathsModel;
			if (this.pathsModel.clusters) {
				// Add cluster nodes to traversal graph body
				const _renderClusterFn = function(cluster) {
					this.body.add(cluster.body);
				};
				_.each(this.pathsModel.clusters, _renderClusterFn.bind(this));
			} else { 
				throw new Error("TraversalGraph requires at least one cluster.");
			}
			this.addLanes();
		} else { 
			throw new Error("Traversal graph needs a pathsModel.");
		}
	}

	getCluster(clusterId) {
		const cluster = this.pathsModel.clusters[clusterId];
		if (cluster) {
			return cluster;
		} else {
			throw new Error("Cluster not found");
		}
	}

	addMobileAgent(agentId, laneId) {
		const lane = this.getLane(laneId);
		if(_.isUndefined(lane)) { throw new Error("Cannot add mobileAgent to undefined lane"); }

		const startPosition = lane.getNodeEntrancePosition();

		const mobileAgent = new MobileAgent(agentId, this);

		mobileAgent.lane = lane;
		mobileAgent.laneQueue.enqueue(lane);
		lane.addMobileAgent(mobileAgent);

		mobileAgent.body.position.x = startPosition.x;
		mobileAgent.body.position.y = startPosition.y;
		mobileAgent.body.position.z = startPosition.z;
		this.mobileAgents.push(mobileAgent);


		this.body.updateMatrixWorld();
		this.body.add(mobileAgent.body);
	}

	removeMobileAgent(mobileAgentId) {
		const lane = this.getMobileAgent(mobileAgentId).lane;
		if (lane) {
			lane.removeMobileAgent(mobileAgentId);
		}
		const mobileAgent = this.getMobileAgent(mobileAgentId).lane = null;
		_.remove(this.mobileAgents, (s) => s.id === mobileAgent.id);
	}

	getMobileAgent(mobileAgentId) {
		const mobileAgent = _.find(this.mobileAgents, (mobileAgent) => { return mobileAgent.id === mobileAgentId; });
		if (mobileAgent) {
			return mobileAgent;
		} else {
			throw new Error("MobileAgent not found"); 
		}
	}

	updateStateSpace(t, /* data */) { 
		this.updateMobileAgents(t);
	}

	updateMobileAgents(t) {
		_.each(this.mobileAgents, (mobileAgent) => {
			mobileAgent.updateMobileAgent(t);
		});
	}

	addLane(/* lane */) { 
		// TODO
	}

	removeLane(/* lane */) {
		// TODO
	}

	getLane(laneId) {
		if (!laneId) { throw new Error('Must pass laneId to getLane()'); }

		const lane = _.find(this.lanes, (lane) => lane.id === laneId);
		if (lane) {
			return lane;
		} else {
			throw new Error("Lane not found");
		}
	}

	// TODO: pass path model
	addLanes() {
		if (this.pathsModel.paths) {
			_.each(this.pathsModel.paths, (_path, i) => {
				const id = "lane " + i.toString();
				const path = this.buildPath(_path); // <-- Object3D

				const entranceNode = this.getNode(_path[1].segment.startNode);
				const exitNode = this.getNode(_path[_path.length - 1].segment.endNode);

				const width = 10;
				const safetyOffset = { left: 0, right: 0 };

				const lane = new Lane(id, entranceNode, exitNode, path, width, safetyOffset, this);

				this.lanes.push(lane);


				// add paths to appropriate cluster and correct for position
				const clusterId = _path[0].pathInfo.clusterId;
				const cluster = this.getCluster(clusterId);

				cluster.body.add(lane.path);

				// this.body.add(lane.path);
			});

			// add initial set of action points to the lane. Other action points can be added dynamically in afterLaneSwitchCallback in path model
			_.each(this.lanes, (lane) => { 
				if (lane.path.pathInfo.actionPoints) {
					lane.buildActionPoints(lane.path.pathInfo.actionPoints);
				} 
			});
		}
	}

	buildPath(_path) {
		const pathSegments = []; // all pathSegments in the path
		const vertices = []; // all vertices in the path
		let clusterId;
		if (_path[0].pathInfo.clusterId) { 
			clusterId = _path[0].pathInfo.clusterId;
		} else { 
			throw new Error("Path is missing clusterId in pathInfo. All paths belong to one cluster.");
		}

		// add each segment to pathSegments array
		// add the vertices from each segment to the vertices array
		let pathInfo;
		let laneExits;

		let pathEntranceVertex;
		let pathExitVertex;

		for (let i = 0; i < _path.length; i++) { 
			const _segment = _path[i];
			if (_segment.pathInfo) { 
				pathInfo = _segment.pathInfo;
				if (pathInfo.laneExits) { 
					laneExits = pathInfo.laneExits;
				}
			} else if (_segment.segment) { 
				const s = _segment.segment;
				let _curve;









				// Define _curve. Extend possible curve types here: TODO: refactor
				if (s.type === 'straight') { 
					_curve = this.buildStraight(this.getNode(s.startNode), this.getNode(s.endNode), s.segments);
				} else if (s.type === 'bend') { 
					_curve = this.buildBend(this.getNode(s.startNode), this.getNode(s.endNode), s.flip, s.segments);
				
				} else { 
					throw new Error("Invalid segment type");
				}









				if (_curve.children[0].geometry.vertices === undefined || _curve.children[0].geometry.vertices === undefined) {
					throw new Error('Vertices undefined');
				}

				for(let j = 0; j < _curve.children[0].geometry.vertices.length; j++) { 
					const v = _curve.children[0].geometry.vertices[j].clone();

					// compute hash of position
					v.positionHash = clusterId + '_x' + v.x.toString() + '_y' + v.y.toString() + '_z' + v.z.toString() ;

					// Intersection:
					// Vertex that is shared by two paths in vertices of lanes. This can be shifted by 
					// "sliding" the intsersection vertex (which is changing it) to another vertex in the crossed path only.
					// Not the other way around. This is why it is best to manage intersections in a road system according 
					// to Nodes
					// intersection ()

					if (this.pathPositionsHashMap[v.positionHash]) { // <-- if point of intersection found 
						// TODO: create intersection object
						this.intersectionVertices.push(v);
					} else {
						this.pathPositionsHashMap[v.positionHash] = v;
						vertices.push(v);
					}

					// add entrance and exit positions for each path
					if (i === 1 && j === 0) {
						pathEntranceVertex = v;
					} else if (i === _path.length - 1 && j === _curve.children[0].geometry.vertices.length - 1) {
						pathExitVertex = v;
					}
				}

				pathSegments.push[_curve];
			}
		}

		// add finalized vertex array to catmullrom curve
		const curve = new THREE.CatmullRomCurve3(vertices);

		// create geometry from points
		const geometry = new THREE.Geometry();
		geometry.vertices = vertices;

		// create material --> Line
		const material = new THREE.LineBasicMaterial({ color: ColorModel.pathColors.generalPathColor });
		const line = new THREE.Line(geometry, material);

		// create THREE.Object3D from Line
		const path = new THREE.Object3D();
		path.add(line);

		// create tube geometry
		const tube = new THREE.TubeGeometry(curve, 1000, 1, 8, false);

		if (pathInfo === undefined) { 
			throw new Error("Path model is missing pathInfo");
		}

		let cluster;
		if (_path[0].pathInfo.clusterId) { 
			clusterId = _path[0].pathInfo.clusterId;
			cluster = this.getCluster(clusterId);
		} else { 
			throw new Error("Path is missing clusterId in pathInfo. All paths belong to one cluster.");
		}

		// all relevant path lane info here:
			// add curve reference to Object3D for reference
		_.extend(path, {
			cluster: cluster,
			pathInfo: pathInfo,
			laneExits: laneExits,
			vertices: geometry.vertices,
			curve: curve,
			entrancePosition: pathEntranceVertex,
			exitPosition: pathExitVertex,
			tube: tube,
			isPath: true 
		});

		return path;
	}

	getIntersectionVertexHash(v) {
		if (v.x !== undefined && v.y !== undefined && v.z !== undefined) { 
			return '_x' + v.x.toString() + '_y' + v.y.toString() + '_z' + v.z.toString();
		} else { 
			throw new Error("Invalid vertex v");
		}
	}

	getIntersectionVertex(intersectionVertexHash) { 
		return _.find(this.intersectionVertices, (intersectionVertex) => { 
			intersectionVertex.positionHash = intersectionVertexHash;
		});
	}

	getRelativePositionVector(startPosition, endPosition) {
		const position = {};
		position.x;
		position.y;
		position.z;

		if (endPosition.x <= startPosition.x) {
			if (endPosition.x === startPosition.x) {
				position.x = 0;
			} else {
				position.x = -1;
			}
		} else {
			position.x = 1;
		}

		if (endPosition.y <= startPosition.y) {
			if (endPosition.y === startPosition.y) {
				position.y = 0;
			} else {
				position.y = -1;
			}
		} else {
			position.y = 1;
		}

		if (endPosition.z <= startPosition.z) {
			if (endPosition.z === startPosition.z) {
				position.z = 0;
			} else {
				position.z = -1;
			}
		} else {
			position.z = 1;
		}

		return position;
	}

	// IMPORTANT: It is up to Clusters to store and retrieve nodes by their nodeId
	// according to the pathsModel hash convention
	// 
	getNode(nodeId) {
		const nodeIdParams = nodeId.split("_");
		if (!_.isEmpty(nodeIdParams)) { 
			const clusterId = nodeIdParams[0];
			const cluster = this.getCluster(clusterId);
			const node = cluster.getNode(nodeId);
			if (node) { 
				return node;
			} else {
				// console.log(nodeId);
				throw new Error("Node not found for nodeId:" + nodeId);
			}
		} else { 
			throw new Error("Invalid nodeId");
		}
	}

	addIntersections() {

	}

	addIOPoints() {

	}

	jump() { 

	} 

	fly() { 

	}

	autoCorrectPosition(v) {
		const ERROR_RANGE = 1 / 1000000;
		let floorX = _.floor(v.x);
		let floorY = _.floor(v.y);
		let floorZ = _.floor(v.z);
		const ceilX = _.ceil(v.x);
		const ceilY = _.ceil(v.y);
		const ceilZ = _.ceil(v.z);

		// X
		for (floorX = _.floor(v.x); floorX < ceilX; floorX += 0.125) { 
			if (_.inRange( v.x , floorX , floorX + ERROR_RANGE ) || _.inRange( v.x , floorX - ERROR_RANGE , floorX )) {
				v.x = floorX;
			}
		}
		if ( _.inRange( v.x , ceilX , ceilX + ERROR_RANGE ) || _.inRange( v.x , ceilX - ERROR_RANGE , ceilX )) {
			v.x = ceilX;
		}
		
		// Y
		for (floorY = _.floor(v.y); floorY < ceilY; floorY += 0.125) { 
			if (_.inRange( v.y , floorY , floorY + ERROR_RANGE ) || _.inRange( v.y , floorY - ERROR_RANGE , floorY )) {
				v.y = floorY;
			}
		}
		if ( _.inRange( v.y , ceilY , ceilY + ERROR_RANGE ) || _.inRange( v.y , ceilY - ERROR_RANGE , ceilY )) {
			v.y = ceilY;
		}

		// Z
		for (floorZ = _.floor(v.z); floorZ < ceilZ; floorZ += 0.125) { 
			if (_.inRange( v.z , floorZ , floorZ + ERROR_RANGE ) || _.inRange( v.z , floorZ - ERROR_RANGE , floorZ )) {
				v.z = floorZ;
			}
		}
		if ( _.inRange( v.z , ceilZ , ceilZ + ERROR_RANGE ) || _.inRange( v.z , ceilZ - ERROR_RANGE , ceilZ )) {
			v.z = ceilZ;
		}
	}

	autoCorrectValue(value) { 
		const ceil = _.ceil(value);
		const ERROR_RANGE = 1 / 1000000;
		let _value = value;

		for (let floor = _.floor(_value); floor < ceil; floor += 0.125) { 
			if (_.inRange( _value , floor , floor + ERROR_RANGE ) || _.inRange( _value , floor - ERROR_RANGE , floor )) {
				_value = floor;
			}
		}
		if ( _.inRange( _value , ceil , ceil + ERROR_RANGE ) || _.inRange( _value , ceil - ERROR_RANGE , ceil )) {
			_value = ceil;
		}

		return _value;
	}

	getNormalizedLaneExitCounter(laneId, exitPosition, mobileAgent) {
		// get exit position on current lane
		const exitLane = this.getLane(laneId);
		let exitIndex;
		let __exitPosition = exitPosition;
		let _exitPosition;

		if (__exitPosition && mobileAgent) { 
			if (mobileAgent) { 
				if (mobileAgent.counter >= 1) { 
					__exitPosition = mobileAgent.lane.exitPosition; // <-- vertex also present in exitLane
				} else if (mobileAgent.counter < 0) {
					// return 1 - (0 - mobileAgent.counter);
					__exitPosition = mobileAgent.lane.entrancePosition; // <-- vertex also present in exitLane
				} else {
					// __exitPosition equal to current lane entrance/exit position
					if (!mobileAgent.reverse) {
						__exitPosition = exitLane.entrancePosition; // <-- if going forward, enter into beginning of exitLane
					} 
					else {
						__exitPosition = exitLane.exitPosition; // <-- if going in reverse, enter into end of exitLane
					}
				}
			}
		} else if (__exitPosition) {
			if (__exitPosition instanceof THREE.Vector3) {
				if (__exitPosition === exitLane.entrancePosition) { 
					return 0;
				} else if (__exitPosition === exitLane.exitPosition) { 
					return 0.99999;
				}
			}
		} else {
			throw new Error("Invalid arguments to getNormalizedLaneExitCounter");
		}

		// search the vertices of the exit lane  for a vertex with a position equal to current lane entrance/exit position
		_exitPosition = _.find(exitLane.path.vertices, (v, i) => {
			exitIndex = i;
			return v.x === __exitPosition.x && v.y === __exitPosition.y && v.z === __exitPosition.z;
		});

		if (!_exitPosition) {
			const exitLaneEntrancePosition = exitLane.entrancePosition;
			const exitLaneExitPosition = exitLane.exitPosition;

			if ((__exitPosition.x === exitLaneEntrancePosition.x) && (__exitPosition.y === exitLaneEntrancePosition.y) && (__exitPosition.z === exitLaneEntrancePosition.z)) { 
				_exitPosition = exitLaneEntrancePosition;
			}

			if ((__exitPosition.x === exitLaneExitPosition.x) && (__exitPosition.y === exitLaneExitPosition.y) && (__exitPosition.z === exitLaneExitPosition.z)) { 
				_exitPosition = exitLaneExitPosition;
			}
		}

		// check exit position
		if (!_exitPosition) { throw new Error("Exit position not found"); }

		// not finding exitPosition ?
		// debugger;

		// get total exit lane curve length
		const curveLength = exitLane.curve.getLength();

		// get head of curve, ending at exitPosition;
		const headCurveVertices = _.slice(exitLane.path.vertices, 0, exitIndex + 1);

		// if at the beginning of the lane
		if (headCurveVertices.length < 2) {
			// 0.9999999999999999 <--- max precision?
			if (mobileAgent) { 
				return !mobileAgent.reverse ? 0 : 0.99999 - (0 - mobileAgent.counter);
			} else { 
				return 0;
			}
		}

		const headCurve = new THREE.CatmullRomCurve3(headCurveVertices);

		// get total length of head curve
		const headCurveLength = headCurve.getLength();

		// calculate normalized exit counter
		let normalizedLaneExitCounter = headCurveLength / curveLength;

		// increment exit counter by normalized current distance beyond current curve length
		if (mobileAgent) { 
			if (!mobileAgent.reverse) { 
				normalizedLaneExitCounter += (mobileAgent.counter - 1);
			} else { 
				normalizedLaneExitCounter -= (0 - mobileAgent.counter);
			}
		}

		// correct for distance error between exitPosition (headCurveLength)
		// and normalized exit counter distance
		// TODO

		return normalizedLaneExitCounter;
	}

	buildStraight(startNode, endNode, segments) {
		const curve = new THREE.LineCurve3(startNode.body.position, endNode.body.position, segments);

		const geometry = new THREE.Geometry();
		geometry.vertices = curve.getPoints(segments);

		const material = new THREE.LineBasicMaterial( { color: ColorModel.pathColors.generalPathColor} );

		const _line = new THREE.Line( geometry, material );

/*      Position test
		if (geometry.vertices[0].x != startNode.body.position.x || geometry.vertices[0].y != startNode.body.position.y || geometry.vertices[0].z != startNode.body.position.z) {
			console.log("Straight not cleared");
			console.log(geometry.vertices[0]);
			console.log(startNode.body.position);
		} else {
			console.log("Straight cleared");
		}

		if (geometry.vertices[geometry.vertices.length - 1].x != endNode.body.position.x || geometry.vertices[geometry.vertices.length - 1].y != endNode.body.position.y 
			|| geometry.vertices[geometry.vertices.length - 1].z != endNode.body.position.z) {
			console.log("Straight not cleared");
			console.log(geometry.vertices[geometry.vertices.length - 1]);
			console.log(startNode.body.position);
		} else {
			console.log("Straight cleared");
		}
*/

		startNode.setColor(ColorModel.nodeColors.startNodeColor);
		endNode.setColor(ColorModel.nodeColors.endNodeColor);

		const line = new THREE.Object3D();
		line.add(_line);

		return line;
	}

	/*
	* Adds a 90 degree bend between any two nodes in a Cubic Lattice
	* with a position on a square diagonal.
	*
	* vertical --> false (horizontal) [default], true
	* rotation --> 0 [default], Math.PI / 2, Math.PI, (3 * Math.PI) / 2

	* [NOTE: buildBend() can be modified later to take values for ellipse curve]
	*
	*/
	buildBend(startNode, endNode, flip, segments) {
		// define start and end positions
		const startPosition = startNode.body.position;
		const endPosition = endNode.body.position;

		// define plane <-- horizontal plane [default]
		let plane = "XZ";

		// determine vertical plane if plane is vertical
		const vertical = startPosition.y !== endPosition.y ? true : false;
		if (vertical) {
			plane = startPosition.z === endPosition.z ? "XY" : "ZY";
		}

		// define radius of arc
		const radius = vertical ? Math.abs(endPosition.y - startPosition.y) : Math.abs(endPosition.z - startPosition.z);

		let vertices;

		const q1 = new THREE.CircleGeometry(radius, segments, 0 , Math.PI / 2 ).vertices;
		const q2 = new THREE.CircleGeometry(radius, segments, Math.PI / 2 , Math.PI / 2 ).vertices;
		const q3 = new THREE.CircleGeometry(radius, segments, Math.PI , Math.PI / 2 ).vertices;
		const q4 = new THREE.CircleGeometry(radius, segments, 3 * Math.PI / 2 , Math.PI / 2 ).vertices;

		q1.splice( 0 , 1 );
		q2.splice( 0 , 1 );
		q3.splice( 0 , 1 );
		q4.splice( 0 , 1 );

		const _r = this.getRelativePositionVector(startPosition, endPosition, radius);

		// Set default horizontal and vertical relative position of vertices
		if (vertical) {
			if (plane === "XY") {
				if ( _r.x === 1 && _r.y === 1) {
					if (flip) {
						vertices = q2;
						_.each(vertices, (v) => {
							v.x += radius;
							this.autoCorrectPosition( v );
						});
						_.reverse(vertices);
					} else {
						vertices = q4;
						_.each(vertices, (v) => {
							v.y += radius;
							this.autoCorrectPosition( v );
						});
					}
				} else if ( _r.x === -1 && _r.y === 1) {
					if (flip) {
						vertices = q1;
						_.each(vertices, (v) => {
							v.x -= radius;
							this.autoCorrectPosition( v );
						});
					} else {
						vertices = q3;
						_.each(vertices, (v) => {
							v.y += radius;
							this.autoCorrectPosition( v );
						});
						_.reverse(vertices);
					}
				} else if ( _r.x === -1 && _r.y === -1) {
					if (flip) {
						vertices = q4;
						_.each(vertices, (v) => {
							v.x -= radius;
							this.autoCorrectPosition( v );
						});
						_.reverse(vertices);
					} else {
						vertices = q2;
						_.each(vertices, (v) => {
							v.y -= radius;
							this.autoCorrectPosition( v );
						});
					}
				} else if ( _r.x === 1 && _r.y === -1) {
					if (flip) {
						vertices = q3;
						_.each(vertices, (v) => {
							v.x += radius;
							this.autoCorrectPosition( v );
						});
					} else {
						vertices = q1;
						_.each(vertices, (v) => {
							v.y -= radius;
							this.autoCorrectPosition( v );
						});
						_.reverse(vertices);
					}
				} else {
					throw new Error ('Bend geometry has invalid relative position');
				}
			} else { // plane ZY
				if ( _r.z === 1 && _r.y === 1) {
					if (flip) {
						vertices = q1;
						_.each(vertices, (v) => {
							v.x -= radius;
							v.applyAxisAngle( new THREE.Vector3( 0 , 1 , 0 ) , Math.PI / 2 );
							this.autoCorrectPosition( v );
						});
					} else {
						vertices = q3;
						_.each(vertices, (v) => {
							v.y += radius;
							v.applyAxisAngle( new THREE.Vector3( 0 , 1 , 0 ) , Math.PI / 2 );
							this.autoCorrectPosition( v );
						});
						_.reverse(vertices);
					}
				} else if ( _r.z === -1 && _r.y === 1) {
					if (flip) {
						vertices = q1;
						_.each(vertices, (v) => {
							v.x -= radius;
							v.applyAxisAngle( new THREE.Vector3( 0 , 1 , 0 ) , -Math.PI / 2 );
							this.autoCorrectPosition( v );
						});
					} else {
						vertices = q3;
						_.each(vertices, (v) => {
							v.y += radius;
							v.applyAxisAngle( new THREE.Vector3( 0 , 1 , 0 ) , -Math.PI / 2 );
							this.autoCorrectPosition( v );
						});
						_.reverse(vertices);
					}
				} else if ( _r.z === -1 && _r.y === -1) {
					if (flip) {
						vertices = q3;
						_.each(vertices, (v) => {
							v.x += radius;
							v.applyAxisAngle( new THREE.Vector3( 0 , 1 , 0 ) , Math.PI / 2 );
							this.autoCorrectPosition( v );
						});
					} else {
						vertices = q1;
						_.each(vertices, (v) => {
							v.y -= radius;
							v.applyAxisAngle( new THREE.Vector3( 0 , 1 , 0 ) , Math.PI / 2 );
							this.autoCorrectPosition( v );
						});
						_.reverse(vertices);
					}
				} else if ( _r.z === 1 && _r.y === -1) {
					if (flip) {
						vertices = q4;
						_.each(vertices, (v) => {
							v.x -= radius;
							v.applyAxisAngle( new THREE.Vector3( 0 , 1 , 0 ) , Math.PI / 2 );
							this.autoCorrectPosition( v );
						});
						_.reverse(vertices);
					} else {
						vertices = q1;
						_.each(vertices, (v) => {
							v.y -= radius;
							v.applyAxisAngle( new THREE.Vector3( 0 , 1 , 0 ) , -Math.PI / 2 );
							this.autoCorrectPosition( v );
						});
						_.reverse(vertices);
					}
				} else {
					throw new Error ('Bend geometry has invalid relative position');
				}
			}
		} else { // plane XZ
			if ( _r.x === 1 && _r.z === 1 ) {
				if (flip) {
					vertices = q4;
					_.each(vertices, (v) => {
						v.y += radius;
						v.applyAxisAngle( new THREE.Vector3( 1 , 0 , 0 ) , Math.PI / 2 );
						this.autoCorrectPosition( v );
					});
				} else {
					vertices = q2;
					_.each(vertices, (v) => {
						v.x += radius;
						v.applyAxisAngle( new THREE.Vector3( 1 , 0 , 0 ) , Math.PI / 2 );
						this.autoCorrectPosition( v );
					});
					_.reverse(vertices);
				}
			} else if ( _r.x === -1 && _r.z === 1 ) {
				if (flip) {
					vertices = q3;
					_.each(vertices, (v) => {
						v.y += radius;
						v.applyAxisAngle( new THREE.Vector3( 1 , 0 , 0 ) , Math.PI / 2 );
						this.autoCorrectPosition( v );
					});
					_.reverse(vertices);
				} else {
					vertices = q1;
					_.each(vertices, (v) => {
						v.x -= radius;
						v.applyAxisAngle( new THREE.Vector3( 1 , 0 , 0 ) , Math.PI / 2 );
						this.autoCorrectPosition( v );
					});
				}
			} else if ( _r.x === -1 && _r.z === -1 ) {
				if (flip) {
					vertices = q3;
					_.each(vertices, (v) => {
						v.y += radius;
						v.applyAxisAngle( new THREE.Vector3( 1 , 0 , 0 ) , -Math.PI / 2 );
						this.autoCorrectPosition( v );
					});
					_.reverse(vertices);
				} else {
					vertices = q1;
					_.each(vertices, (v) => {
						v.x -= radius;
						v.applyAxisAngle( new THREE.Vector3( 1 , 0 , 0 ) , -Math.PI / 2 );
						this.autoCorrectPosition( v );
					});
				}
			} else if ( _r.x === 1 && _r.z === -1 ) {
				if (flip) {
					vertices = q2;
					_.each(vertices, (v) => {
						v.x += radius;
						v.applyAxisAngle( new THREE.Vector3( 1 , 0 , 0 ) , -Math.PI / 2 );
						this.autoCorrectPosition( v );
					});
					_.reverse(vertices);
				} else {
					vertices = q4;
					_.each(vertices, (v) => {
						v.y += radius;
						v.applyAxisAngle( new THREE.Vector3( 1 , 0 , 0 ) , -Math.PI / 2 );
						this.autoCorrectPosition( v );
					});
				}
			} else {
				throw new Error ('Bend geometry has invalid relative position');
			}
		}

		// Update position of vertices relative to startingNode position
		_.each(vertices, (v) => {
			v.x += startPosition.x;
			v.y += startPosition.y;
			v.z += startPosition.z;
		});

		/* Position test
		if (vertices[0].x != startPosition.x || vertices[0].y != startPosition.y || vertices[0].z != startPosition.z) {
			console.log("Bend not cleared");
			console.log(vertices[0]);
			console.log(startPosition);
		} else {
			console.log("Bend cleared");
		}

		if (vertices[vertices.length - 1].x != endPosition.x || vertices[vertices.length - 1].y != endPosition.y || vertices[vertices.length - 1].z != endPosition.z) {
			console.log("Bend not cleared");
			console.log(vertices[vertices.length - 1]);
			console.log(endPosition);
		} else {
			console.log("Bend cleared");
		}
		*/

		// Create geometry from vertices
		const geometry = new THREE.Geometry();
		geometry.vertices = vertices;

		const material = new THREE.LineBasicMaterial( { color: ColorModel.pathColors.generalPathColor } );
		const _line = new THREE.Line( geometry, material );

		// Create the final Object3d to add to the scene
		const line = new THREE.Object3D();
		line.add(_line);

		// Set other startNode and endNode attributes
		startNode.setColor(ColorModel.nodeColors.startNodeColor);
		endNode.setColor(ColorModel.nodeColors.endNodeColor);

		return line;
	}
}