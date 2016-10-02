import * as _ from 'lodash';
import * as THREE from 'three';
import PathTraversalModel from '../../simulation-model/world/TraversalGraph/models/PathTraversalModel';
import CubicLatticeCluster from '../../simulation-model/world/TraversalGraph/models/clusters/CubicLatticeCluster';

export default class RandomExamplePathModel extends PathTraversalModel { 
	constructor() {
		super();
		this.buildClusters();
		this.buildPathsModel();
	}

	// build this.clusters below if not already built
	buildClusters() {}

	// All paths model logic encapsulated here. build this.paths
		// All paths model logic encapsulated here. build this.paths
	buildPathsModel() { 
		// TODO for ASRS paths model

		this.clusters = { 
			lattice1: new CubicLatticeCluster( "lattice1", 5 , 5 , 5 , 20 , new THREE.Vector3( 0 , 0 , 0 ) ),
			lattice2: new CubicLatticeCluster( "lattice2", 5 , 5 , 5 , 20 , new THREE.Vector3( 80 , 0 , 0 ) )
		};

		// REQUIRED
		// {paths    {lane    {pathInfo}{segment}...} {lane    {pathInfo}{segment}...}
		this.paths = [
			// Bend flipping:       horizontal: true (going left), false (going straight)
			//                      vertical: true: (going forward), false (going up)
			// lane 0
			[
				{
					pathInfo: {
						clusterId: "lattice1",
						laneExits: [
							{
								default: true,
								entranceLaneId: "lane 0",
								// entranceLanePosition: position <-- if other than lane entrance position
								exitLaneId: "lane 0"
								// exitLanePosition: position <-- if other than lane exit position
							}
						],

						// added in no particular order since counter is specified
						actionPoints: [
							{
								id: "changeVelocityAndColor",
								laneId: "lane 0",
								counter: 0.9,
								stop: false,

								// Provide a standard set of callbacks to check and manipulate state space

								// return true or false
								completionCheck: undefined,

								// action
								callback: function(mobileAgent) {
// debugger;
									// change velocity and color of agent
									mobileAgent.v = 5;
									const _randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
									const randomColor = new THREE.Color(_randomColor);
									mobileAgent.setColor(randomColor);
								},

								// action on completion
								completionCallback: undefined,
								flushCompletionCheck: undefined,
								flushCallback: true
							},

							{
								id: "changeVelocityAndColor",
								laneId: "lane 0",
								counter: 0.45, 
								stop: false,
								

								// return true or false              
								completionCheck: function(mobileAgent) { 
									return mobileAgent.counter >= 0.7;
								},

								// action
								callback: function(mobileAgent) {
									// change velocity and color of agent
// debugger;
									mobileAgent.v = 10;
									const _randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
									const randomColor = new THREE.Color(_randomColor);
									mobileAgent.setColor(randomColor);
								},

								// action on completion
								completionCallback: function(mobileAgent) {
// debugger;
									mobileAgent.v = 2;
									const _randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
									const randomColor = new THREE.Color(_randomColor);
									mobileAgent.setColor(randomColor);
								},
								flushCompletionCheck: true, // "false" by default
								flushCallback: true
							},

							{
								id: "switchLane",
								laneId: "lane 0",
								counter: function(traversalGraph) {
									// get lane 1, and lane 0 exit counter
									const lane1 = traversalGraph.getLane("lane 1");
									const lane0ExitCounter = traversalGraph.getNormalizedLaneExitCounter("lane 0", lane1.exitPosition);

									// the vertex where lane 1 exits onto lane 0
									return lane0ExitCounter;
								},

								// return true or false              
								stop: false,
								
								completionCheck: undefined, // must be added. can be set to undefined
								callback: function(mobileAgent) {
// debugger;
									// get lane 1, and lane 0 exit counter
									const lane1 = mobileAgent.traversalGraph.getLane("lane 1");
									const lane1EntryCounter = mobileAgent.traversalGraph.getNormalizedLaneExitCounter("lane 1", lane1.exitPosition);

									if (mobileAgent.reverse) {
										const activeActionPointCounter = _.isFunction(mobileAgent.activeActionPoint.counter) ? mobileAgent.activeActionPoint.counter(mobileAgent.traversalGraph) : mobileAgent.activeActionPoint.counter;             
										const distOverActionPointCounter = mobileAgent.counter - activeActionPointCounter;
										mobileAgent.switchLane(lane1, lane1EntryCounter + distOverActionPointCounter);
									}
								},
								completionCallback: undefined,
								flushCompletionCheck: undefined,
								flushCallback: true
							},

							{
								id: "switchLane",
								laneId: "lane 0",
								counter: function(traversalGraph) {
									// get lane 1, and lane 0 exit counter
									const lane2 = traversalGraph.getLane("lane 2");
									// or can retrieve a node can pass the position of that node to getNormalizedLaneExitCounter

									// IMPORTANT: Nodes have a position that is equal to a position of a vertex in the vertices of
									// the path model that define intersections between two or more lanes. In this example pathsModel, the exitPosition
									// of lane 2 is equal to the position of a vertex in lane 0 that can be used to calculate the normalized
									// distance from the beginning of lane 0 to the point of intersection with lane 2, whereby the 
									// the transitioning mobileAgent can exit onto lane 0 from lane 2 at the correct normalized position on lane 0. 
									const lane0ExitCounter = traversalGraph.getNormalizedLaneExitCounter("lane 0", lane2.exitPosition);

									// the vertex where lane 2 exits onto lane 0
									return lane0ExitCounter;
								},

								// return true or false              
								stop: false,
								
								completionCheck: undefined, // must be added. can be set to undefined
								callback: function(mobileAgent) {
// debugger;
									// get lane 1, and lane 0 exit counter
									const lane2 = mobileAgent.traversalGraph.getLane("lane 2");
									const lane2EntryCounter = mobileAgent.traversalGraph.getNormalizedLaneExitCounter("lane 2", lane2.exitPosition);

									if (mobileAgent.reverse) {
										const activeActionPointCounter = _.isFunction(mobileAgent.activeActionPoint.counter) ? mobileAgent.activeActionPoint.counter(mobileAgent.traversalGraph) : mobileAgent.activeActionPoint.counter;
										const distOverActionPointCounter = mobileAgent.counter - activeActionPointCounter; 
										mobileAgent.switchLane(lane2, lane2EntryCounter + distOverActionPointCounter);
									}
								},
								completionCallback: undefined,
								flushCompletionCheck: undefined,
								flushCallback: true
							}
						]
					}
				},
				{
					segment: {
						startNode: "lattice1_0_0_2",
						endNode: "lattice1_1_0_2",
						type: 'straight',
						segments: 100 
					}
				},
				{
					segment: {
						startNode: "lattice1_1_0_2",
						endNode: "lattice1_2_0_3",
						type: 'bend',
						flip: false,
						segments: 100
					}
				},
				{
					segment: {
						startNode: "lattice1_2_0_3",
						endNode: "lattice1_2_1_4",
						type: 'bend',
						flip: false,
						segments: 100
					}
				},
				{
					segment: {
						startNode: "lattice1_2_1_4",
						endNode: "lattice1_3_2_4",
						type: 'bend',
						flip: true,
						segments: 100
					}
				},
				{
					segment: {
						startNode: "lattice1_3_2_4",
						endNode: "lattice1_4_2_3",
						type: 'bend',
						flip: true,
						segments: 100
					}
				},
				{
					segment: {
						startNode: "lattice1_4_2_3",
						endNode: "lattice1_4_2_2",
						type: 'straight',
						segments: 100
					}
				},
				{
					segment: {
						startNode: "lattice1_4_2_2",
						endNode: "lattice1_4_1_1",
						type: 'bend',
						flip: true,
						segments: 100
					}
				},
				{
					segment: {
						startNode: "lattice1_4_1_1",
						endNode: "lattice1_4_0_0",
						type: 'bend',
						flip: false,
						segments: 100
					}
				},
				{
					segment: {
						startNode: "lattice1_4_0_0",
						endNode: "lattice1_2_0_0",
						type: 'straight',
						segments: 100
					}
				},
				{
					segment: {
						startNode: "lattice1_2_0_0",
						endNode: "lattice1_0_0_2",
						type: 'bend',
						flip: true,
						segments: 100 // in order for vehicle to leave road system
									// place [roadSystemExit: true] here.
									//
					}
				}
			],

			// Bend flipping:       horizontal: true (going left), false (going straight)
			//                      vertical: true: (going up/down), false (going forward)
			// lane 1
			[
				{
					pathInfo: {
						clusterId: "lattice1",
						laneExits: [ 
							{
								default: true,
								entranceLaneId: "lane 0",
								// entranceLanePosition: position <-- if other than lane entrance position
								exitLaneId: "lane 0"
								// exitLanePosition: position <-- if other than lane exit position
							}
						],

						actionPoints: [
							{
								id: "switchLane",
								laneId: "lane 1",
								counter: function(traversalGraph) {
									// get lane 1, and lane 0 exit counter
									// const lane1 = traversalGraph.getLane("lane 1");









									// will not work. cannot use position of node to find exit counter
									const lane1tolane2ExitPosition = traversalGraph.getNode("lattice1_2_2_2").pathPosition;









									// this normalized exit lane counter needs to be cached. expensive operation
									const lane1tolane2ExitCounter = traversalGraph.getNormalizedLaneExitCounter("lane 1", lane1tolane2ExitPosition);
									// the vertex where lane 1 exits onto lane 2
									return lane1tolane2ExitCounter;
								},             
								stop: false,
								

								// return true or false 
								completionCheck: undefined, // must be added. can be set to undefined
								callback: function(mobileAgent) {
									const lane2 = mobileAgent.traversalGraph.getLane("lane 2");
									const lane2EntryCounter = mobileAgent.traversalGraph.getNormalizedLaneExitCounter("lane 2", lane2.entrancePosition);

									if (!mobileAgent.reverse) { 
										mobileAgent.switchLane(lane2, lane2EntryCounter);
									}
								},
								completionCallback: undefined,
								flushCompletionCheck: undefined,
								flushCallback: true
							}
						]
					}
				},
				{
					segment: {
						startNode: "lattice1_0_0_2",
						endNode: "lattice1_0_1_2",
						type: 'straight',
						segments: 100
					}
				},
				{
					segment: {
						startNode: "lattice1_0_1_2",
						endNode: "lattice1_1_1_2",
						type: 'straight',
						segments: 100
					}
				},
				{
					segment: {
						startNode: "lattice1_1_1_2",
						endNode: "lattice1_2_2_2",
						type: 'bend',
						flip: false,
						segments: 100
					}
				},
				{
					segment: {
						startNode: "lattice1_2_2_2",
						endNode: "lattice1_2_1_1",
						type: 'bend',
						flip: false,
						segments: 100
					}
				},
				{
					segment: {
						startNode: "lattice1_2_1_1",
						endNode: "lattice1_2_0_0",
						type: 'bend',
						flip: false,
						segments: 100
					}
				}
			],

			// Bend flipping:       horizontal: true (going left), false (going straight)
			//                      vertical: true: (going up/down), false (going forward)
			// lane 2
			[
				{
					pathInfo: {
						clusterId: "lattice1",
						laneExits: [ 
							{
								default: true,
								entranceLaneId: "lane 1",
								// entranceLanePosition: position <-- if other than lane entrance position
								exitLaneId: "lane 0"
								// exitLanePosition: position <-- if other than lane exit position
							}
						]
					}
				},
				{
					segment: {
						startNode: "lattice1_2_2_2",
						endNode: "lattice1_3_1_2",
						type: 'bend',
						flip: false,
						segments: 100
					}
				},
				{
					segment: {
						startNode: "lattice1_3_1_2",
						endNode: "lattice1_3_1_1",
						type: 'straight',
						segments: 100
					}
				},
				{
					segment: {
						startNode: "lattice1_3_1_1",
						endNode: "lattice1_4_1_1",
						type: 'straight',
						segments: 100
					}
				}
			],


			// Bend flipping:       horizontal: true (going left), false (going straight)
			//                      vertical: true: (going forward), false (going up)
			// lane 3
			[
				{
					pathInfo: {
						clusterId: "lattice2",
						laneExits: [
							{
								default: true,
								entranceLaneId: "lane 3",
								// entranceLanePosition: position <-- if other than lane entrance position
								exitLaneId: "lane 3"
								// exitLanePosition: position <-- if other than lane exit position
							}
						],

						// added in no particular order since counter is specified
						actionPoints: [
							{
								id: "changeVelocityAndColor",
								laneId: "lane 3",
								counter: 0.9,
								stop: false,

								// Provide a standard set of callbacks to check and manipulate state space

								// return true or false
								completionCheck: undefined,

								// action
								callback: function(mobileAgent) {
// debugger;
									// change velocity and color of agent
									mobileAgent.v = 5;
									const _randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
									const randomColor = new THREE.Color(_randomColor);
									mobileAgent.setColor(randomColor);
								},

								// action on completion
								completionCallback: undefined,
								flushCompletionCheck: undefined,
								flushCallback: true
							},

							{
								id: "changeVelocityAndColor",
								laneId: "lane 3",
								counter: 0.45, 
								stop: false,
								

								// return true or false              
								completionCheck: function(mobileAgent) { 
									return mobileAgent.counter >= 0.7;
								},

								// action
								callback: function(mobileAgent) {
									// change velocity and color of agent
// debugger;
									mobileAgent.v = 10;
									const _randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
									const randomColor = new THREE.Color(_randomColor);
									mobileAgent.setColor(randomColor);
								},

								// action on completion
								completionCallback: function(mobileAgent) {
// debugger;
									mobileAgent.v = 2;
									const _randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
									const randomColor = new THREE.Color(_randomColor);
									mobileAgent.setColor(randomColor);
								},
								flushCompletionCheck: true, // "false" by default
								flushCallback: true
							},

							{
								id: "switchLane",
								laneId: "lane 3",
								counter: function(traversalGraph) {
									// get lane 4, and lane 3 exit counter
									const lane4 = traversalGraph.getLane("lane 4");
									const lane3ExitCounter = traversalGraph.getNormalizedLaneExitCounter("lane 3", lane4.exitPosition);

									// the vertex where lane 4 exits onto lane 3
									return lane3ExitCounter;
								},

								// return true or false              
								stop: false,
								
								completionCheck: undefined, // must be added. can be set to undefined
								callback: function(mobileAgent) {
// debugger;
									// get lane 1, and lane 0 exit counter
									const lane4 = mobileAgent.traversalGraph.getLane("lane 4");
									const lane4EntryCounter = mobileAgent.traversalGraph.getNormalizedLaneExitCounter("lane 4", lane4.exitPosition);

									if (mobileAgent.reverse) {
										const activeActionPointCounter = _.isFunction(mobileAgent.activeActionPoint.counter) ? mobileAgent.activeActionPoint.counter(mobileAgent.traversalGraph) : mobileAgent.activeActionPoint.counter;             
										const distOverActionPointCounter = mobileAgent.counter - activeActionPointCounter;
										mobileAgent.switchLane(lane4, lane4EntryCounter + distOverActionPointCounter);
									}
								},
								completionCallback: undefined,
								flushCompletionCheck: undefined,
								flushCallback: true
							},

							{
								id: "switchLane",
								laneId: "lane 3",
								counter: function(traversalGraph) {
									// get lane 1, and lane 0 exit counter
									const lane5 = traversalGraph.getLane("lane 5");
									// or can retrieve a node can pass the position of that node to getNormalizedLaneExitCounter

									// IMPORTANT: Nodes have a position that is equal to a position of a vertex in the vertices of
									// the path model that define intersections between two or more lanes. In this example pathsModel, the exitPosition
									// of lane 2 is equal to the position of a vertex in lane 0 that can be used to calculate the normalized
									// distance from the beginning of lane 0 to the point of intersection with lane 2, whereby the 
									// the transitioning mobileAgent can exit onto lane 0 from lane 2 at the correct normalized position on lane 0. 
									const lane3ExitCounter = traversalGraph.getNormalizedLaneExitCounter("lane 3", lane5.exitPosition);

									// the vertex where lane 2 exits onto lane 0
									return lane3ExitCounter;
								},

								// return true or false              
								stop: false,
								
								completionCheck: undefined, // must be added. can be set to undefined
								callback: function(mobileAgent) {
// debugger;
									// get lane 1, and lane 0 exit counter
									const lane5 = mobileAgent.traversalGraph.getLane("lane 5");
									const lane5EntryCounter = mobileAgent.traversalGraph.getNormalizedLaneExitCounter("lane 5", lane5.exitPosition);

									if (mobileAgent.reverse) {
										const activeActionPointCounter = _.isFunction(mobileAgent.activeActionPoint.counter) ? mobileAgent.activeActionPoint.counter(mobileAgent.traversalGraph) : mobileAgent.activeActionPoint.counter;
										const distOverActionPointCounter = mobileAgent.counter - activeActionPointCounter; 
										mobileAgent.switchLane(lane5, lane5EntryCounter + distOverActionPointCounter);
									}
								},
								completionCallback: undefined,
								flushCompletionCheck: undefined,
								flushCallback: true
							}
						]
					}
				},
				{
					segment: {
						startNode: "lattice2_0_0_2",
						endNode: "lattice2_1_0_2",
						type: 'straight',
						segments: 100 
					}
				},
				{
					segment: {
						startNode: "lattice2_1_0_2",
						endNode: "lattice2_2_0_3",
						type: 'bend',
						flip: false,
						segments: 100
					}
				},
				{
					segment: {
						startNode: "lattice2_2_0_3",
						endNode: "lattice2_2_1_4",
						type: 'bend',
						flip: false,
						segments: 100
					}
				},
				{
					segment: {
						startNode: "lattice2_2_1_4",
						endNode: "lattice2_3_2_4",
						type: 'bend',
						flip: true,
						segments: 100
					}
				},
				{
					segment: {
						startNode: "lattice2_3_2_4",
						endNode: "lattice2_4_2_3",
						type: 'bend',
						flip: true,
						segments: 100
					}
				},
				{
					segment: {
						startNode: "lattice2_4_2_3",
						endNode: "lattice2_4_2_2",
						type: 'straight',
						segments: 100
					}
				},
				{
					segment: {
						startNode: "lattice2_4_2_2",
						endNode: "lattice2_4_1_1",
						type: 'bend',
						flip: true,
						segments: 100
					}
				},
				{
					segment: {
						startNode: "lattice2_4_1_1",
						endNode: "lattice2_4_0_0",
						type: 'bend',
						flip: false,
						segments: 100
					}
				},
				{
					segment: {
						startNode: "lattice2_4_0_0",
						endNode: "lattice2_2_0_0",
						type: 'straight',
						segments: 100
					}
				},
				{
					segment: {
						startNode: "lattice2_2_0_0",
						endNode: "lattice2_0_0_2",
						type: 'bend',
						flip: true,
						segments: 100 // in order for vehicle to leave road system
									// place [roadSystemExit: true] here.
									//
					}
				}
			],



			// Bend flipping:       horizontal: true (going left), false (going straight)
			//                      vertical: true: (going up/down), false (going forward)
			// lane 4
			[
				{
					pathInfo: {
						clusterId: "lattice2",
						laneExits: [ 
							{
								default: true,
								entranceLaneId: "lane 3",
								// entranceLanePosition: position <-- if other than lane entrance position
								exitLaneId: "lane 3"
								// exitLanePosition: position <-- if other than lane exit position
							}
						],

						actionPoints: [
							{
								id: "switchLane",
								laneId: "lane 4",
								counter: function(traversalGraph) {
									// get lane 4
									// var lane4 = traversalGraph.getLane("lane 4");




									// lane5 exit position


									// will not work
									const lane4tolane5ExitPosition = traversalGraph.getNode("lattice2_2_2_2").pathPosition;









									// this normalized exit lane counter needs to be cached. expensive operation
									const lane4tolane5ExitCounter = traversalGraph.getNormalizedLaneExitCounter("lane 4", lane4tolane5ExitPosition);
									// the vertex where lane 1 exits onto lane 2
									return lane4tolane5ExitCounter;
								},             
								stop: false,
								

								// return true or false 
								completionCheck: undefined, // must be added. can be set to undefined
								callback: function(mobileAgent) {
									const lane5 = mobileAgent.traversalGraph.getLane("lane 5");
									const lane5EntryCounter = mobileAgent.traversalGraph.getNormalizedLaneExitCounter("lane 5", lane5.entrancePosition);

									if (!mobileAgent.reverse) { 
										mobileAgent.switchLane(lane5, lane5EntryCounter);
									}
								},
								completionCallback: undefined,
								flushCompletionCheck: undefined,
								flushCallback: true
							}
						]
					}
				},
				{
					segment: {
						startNode: "lattice2_0_0_2",
						endNode: "lattice2_0_1_2",
						type: 'straight',
						segments: 100
					}
				},
				{
					segment: {
						startNode: "lattice2_0_1_2",
						endNode: "lattice2_1_1_2",
						type: 'straight',
						segments: 100
					}
				},
				{
					segment: {
						startNode: "lattice2_1_1_2",
						endNode: "lattice2_2_2_2",
						type: 'bend',
						flip: false,
						segments: 100
					}
				},
				{
					segment: {
						startNode: "lattice2_2_2_2",
						endNode: "lattice2_2_1_1",
						type: 'bend',
						flip: false,
						segments: 100
					}
				},
				{
					segment: {
						startNode: "lattice2_2_1_1",
						endNode: "lattice2_2_0_0",
						type: 'bend',
						flip: false,
						segments: 100
					}
				}
			],


			// Bend flipping:       horizontal: true (going left), false (going straight)
			//                      vertical: true: (going up/down), false (going forward)
			// lane 5
			[
				{
					pathInfo: {
						clusterId: "lattice2",
						laneExits: [ 
							{
								default: true,
								entranceLaneId: "lane 4",
								// entranceLanePosition: position <-- if other than lane entrance position
								exitLaneId: "lane 3"
								// exitLanePosition: position <-- if other than lane exit position
							}
						]
					}
				},
				{
					segment: {
						startNode: "lattice2_2_2_2",
						endNode: "lattice2_3_1_2",
						type: 'bend',
						flip: false,
						segments: 100
					}
				},
				{
					segment: {
						startNode: "lattice2_3_1_2",
						endNode: "lattice2_3_1_1",
						type: 'straight',
						segments: 100
					}
				},
				{
					segment: {
						startNode: "lattice2_3_1_1",
						endNode: "lattice2_4_1_1",
						type: 'straight',
						segments: 100
					}
				}
			]
		];
	}

	// REQUIRED
	getNextLane(mobileAgent, counter) {
		// laneIOGraph automatically generates the appropriate entrance and exit counters
		// for lane entry and exit.

		// calculate counter
		let c;
		if (counter !== undefined) { 
			c = counter;
		} else { 
			c === !mobileAgent.reverse ? mobileAgent.counter - 1 : (1 - (mobileAgent.counter * -1));
		}

		// switch lane
		switch(mobileAgent.lane.id) {

		// lattice1 lanes (lane 0 - lane 2)
		case "lane 0": {
			// Lane joints go here in the event of an intersection with multiple outbound lanes:
			// Lane joint using mobile agent state space info

			if (!mobileAgent.reverse) { // (example lane joint for now)
				if (mobileAgent.previousLane.id === "lane 1") {
					mobileAgent.switchLane(mobileAgent.traversalGraph.getLane("lane 0"), c);
				} else if (mobileAgent.previousLane.id === "lane 0") { 
					mobileAgent.switchLane(mobileAgent.traversalGraph.getLane("lane 1"), c);
				}

				if (mobileAgent.previousLane.id === "lane 1") { 
					mobileAgent.previousLane = mobileAgent.traversalGraph.getLane("lane 0");
				} else if (mobileAgent.previousLane.id === "lane 0") { 
					mobileAgent.previousLane = mobileAgent.traversalGraph.getLane("lane 1");
				}
			} else { 
				mobileAgent.switchLane(mobileAgent.traversalGraph.getLane("lane 0"), c);
			}
			break;
		}
		case "lane 1": {
			// mobileAgent.previousLane = mobileAgent.traversalGraph.getLane("lane 1"); // <-- goes at top of each case
			// Lane joints go here in the event of an intersection :

			// no lane joint

			if (!mobileAgent.reverse) { 
				mobileAgent.switchLane(mobileAgent.traversalGraph.getLane("lane 0"), c);
			} else { 
				mobileAgent.switchLane(mobileAgent.traversalGraph.getLane("lane 0"), c);
			}
			break;
		}
		case "lane 2": {
			// calculate appropriate counters

			// refactor getNormalizedCounter
			// refactor lane switching logic in action points to call getNextLane
			// refactor to place all lane switching logic in getNextLane

			const lane0 = mobileAgent.traversalGraph.getLane("lane 0");
			const lane1 = mobileAgent.traversalGraph.getLane("lane 1");

			if (!mobileAgent.reverse) { 
				mobileAgent.switchLane(lane0, c);
			} else { 
				mobileAgent.switchLane(lane1, c);
			}
/*
			if (!mobileAgent.reverse) { 
				mobileAgent.switchLane(mobileAgent.traversalGraph.getLane("lane 0"), c);
			} else { 
				mobileAgent.switchLane(mobileAgent.traversalGraph.getLane("lane 1"), c);
			}
*/
			break;
		// lattice2 lanes (lane 3 - lane 5)
		}
		case "lane 3": {
			// Lane joints go here in the event of an intersection with multiple outbound lanes:
			// Lane joint using mobile agent state space info

			if (!mobileAgent.reverse) { // (example lane joint for now)
				if (mobileAgent.previousLane.id === "lane 4") {
					mobileAgent.switchLane(mobileAgent.traversalGraph.getLane("lane 3"), c);
				} else if (mobileAgent.previousLane.id === "lane 3") { 
					mobileAgent.switchLane(mobileAgent.traversalGraph.getLane("lane 4"), c);
				}

				if (mobileAgent.previousLane.id === "lane 4") { 
					mobileAgent.previousLane = mobileAgent.traversalGraph.getLane("lane 3");
				} else if (mobileAgent.previousLane.id === "lane 3") { 
					mobileAgent.previousLane = mobileAgent.traversalGraph.getLane("lane 4");
				}
			} else { 
				mobileAgent.switchLane(mobileAgent.traversalGraph.getLane("lane 3"), c);
			}
			break;
		}
		case "lane 4": {
			// mobileAgent.previousLane = mobileAgent.traversalGraph.getLane("lane 4"); // <-- goes at top of each case
			// Lane joints go here in the event of an intersection :

			// no lane joint

			if (!mobileAgent.reverse) { 
				mobileAgent.switchLane(mobileAgent.traversalGraph.getLane("lane 3"), c);
			} else { 
				mobileAgent.switchLane(mobileAgent.traversalGraph.getLane("lane 3"), c);
			}
			break;
		}
		case "lane 5": {
			// calculate appropriate counters

			// refactor getNormalizedCounter
			// refactor lane switching logic in action points to call getNextLane
			// refactor to place all lane switching logic in getNextLane

			const lane3 = mobileAgent.traversalGraph.getLane("lane 3");
			const lane4 = mobileAgent.traversalGraph.getLane("lane 4");

			if (!mobileAgent.reverse) { 
				mobileAgent.switchLane(lane3, c);
			} else { 
				mobileAgent.switchLane(lane4, c);
			}
/*
			if (!mobileAgent.reverse) { 
				mobileAgent.switchLane(mobileAgent.traversalGraph.getLane("lane 0"), c);
			} else { 
				mobileAgent.switchLane(mobileAgent.traversalGraph.getLane("lane 1"), c);
			}
*/
			break;
		}
		default:
			// console.log("No lane transition specified for " + mobileAgent.lane.id);
			mobileAgent.inTransition = false;
		}
	} 

	// Given the current lane of the mobileAgent, add the possible set of actionPoints to the mobileAgent.
	afterLaneSwitchCallback(mobileAgent) {
		// you're either in a lane you've enterered into, or ar entering a new lane, along any point in the curve. 
		// therefore the below logic can be used to add the appropriate action points along each path
		// prior to switching into a lane. In this manner, the mobileAgent is receiving/activating a set of valid action
		// points prior to making traversal decisions in the lane.

		// during lane traversal active actionPoints can be changed dynamically 
		// by manipulating the set of activePoints in the activeActionPointQueue
		// and polling the next actionPoint from the new set. The actionPoints must be pre-plotted
		// in order to be added to the activeActionPointQueue

		// Update activeActionIds to dynamically update the set of actionPoints in the activeActionPointQueue
		const _activeActionIds = this._getActiveActionIds();
		const activeActionIds = _activeActionIds ? _activeActionIds : ["changeVelocityAndColor", "switchLane"]; // activeActionIds undefined 
// debugger;
		if (mobileAgent.lane.path.actionPoints) {
			// the "real" add action point logic
			// add addActionPoint wrapper function to mobile agent
			// create get action point function to get action point by id
			// logic below adds actionPoint by id from lane accounting for direction
// debugger;                
			_.each(mobileAgent.lane.path.actionPoints, (actionPoint) => {
				_.each(activeActionIds, (actionId) => { 
					if (actionPoint.id === actionId) {
						// required pattern for accessing actionPoint counter. since counter can be defined by a function or by t
						const actionPointCounter = _.isFunction(actionPoint.counter) ? actionPoint.counter(mobileAgent.traversalGraph) : actionPoint.counter;

						if (!mobileAgent.reverse) { 
							if (mobileAgent.counter <= actionPointCounter) {
// debugger;
								actionPoint.traversalGraph = mobileAgent.traversalGraph;
								mobileAgent.addActionPoint(actionPoint);
							}
						} else { 
							if (mobileAgent.counter >= actionPointCounter ) {
// debugger;
								actionPoint.traversalGraph = mobileAgent.traversalGraph;
								mobileAgent.addActionPoint(actionPoint);
							}
						}
					}
				});
			});
		}

		mobileAgent.checkActiveActionPoint();
	} 

	_getActiveActionIds(/* laneId */) {
		// TODO dynamic active action point update called in afterLaneSwitchCallback
		return false;
	}
}