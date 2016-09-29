/*
All MobileAgent properties and functionalities are included in this
object, with other necessary dependencies

The MobileAgent scene graph should be included in this object, with an API
to manipulate Node properties as provided by a MobileAgent API by which this
this object has access to either within this object or provided as a dependency.
*/

import * as _ from 'lodash';
import * as THREE from 'three';

import TimeModel from '../../world_config_models/TimeModel'
import ColorModel from '../../world_config_models/ColorModel'
import Queue from './utils/Queue'
import PriorityQueue from 'js-priority-queue'

export default class MobileAgent { 
    constructor(id, traversalGraph) { 
        this.init(id, traversalGraph)
    }

    init(id, traversalGraph) {
        this.id = id;
        this.traversalGraph = traversalGraph;
        this.isMobileAgent = true;

        this.geometry;
        this.material;
        this.body;

        this.length = 5;
        this.height = 5;
        this.width = 5;
        //this.dist_from_front_to_front_axle;
        //this.dist_from_front_to_rear_axle;
        //this.wheelbase;

        this.MAX_VELOCITY = 10;
        this.MIN_VELOCITY = 0;
        this.MAX_ACCELERATION_RATE = 3;
        this.MIN_ACCELERATION_RATE = -3;
        this.MAX_DECELERATION_RATE = 3;
        this.MIN_DECELERATION_RATE = -3;
        this.SAFETY_DISTANCE = 0;
        //this.SENSOR_RANGE;
        //this.MAX_STEERING_ANGLE;

        this.a = 0.0;
        this.v = 0.0;

        this.heading = 0;
        this.position;

        this.counter = 0;
        this.axis;
        this.laneQueue = new Queue();

        // registeredActionPoints is filtered/flushed into activeActionPoints
        // upon the entry of a mobile agent into a lane. Active actionPoints are error checked.
        // Registered actionPoints are not error checked. An actionPoint from the registered queue
        // is filtered into the active queue if the counter position upon entry into the 
        // lane is l.t the counter position of the actionPoint. <-- use mapReduce

        // refactor path model logic back into mobile agent then finish active action point queue idea

        this.registeredActionPoints;
        this.activeActionPointQueue;
        this.activeActionPoint;
        this.activeCompletionChecks = [];

        this.distanceTraveled = 0;
        this.previousPosition = null;
        this.previousLane;

        this.initialPosition;
        this.sourcePosition;
        this.destinationPosition;
        this.stopPosition;

        this.inTransition = true;
        this.positionCorrected = false;
        this.reverse = false;

        this.buildBody();
        this.buildInternalBody();
    }

    /* Can be overriden by child object to describe agent specific geometry */
    buildBody() {
        this.body = new THREE.Object3D();

        this.geometry = new THREE.CubeGeometry(5, 5, 5);
        this.material = new THREE.MeshBasicMaterial( { color: ColorModel.agentColors.mobileAgentColor, wireframe: true, wireframeLinewidth: 1, side: THREE.DoubleSide } );
        var bodyMesh = new THREE.Mesh(this.geometry, this.material);
        this.body.add(bodyMesh);

        this.body.up = new THREE.Vector3(0, 1, 0);
        this.axis = new THREE.Vector3();

        return this.body;
    }

    /* Can be overriden by child object to describe agent specific geometry */
    buildInternalBody() {
        var arrowGeometry = new THREE.Geometry();
        var mesh = new THREE.Mesh(new THREE.CylinderGeometry( 0, 1, 5, 12, 1, false));
        arrowGeometry.merge( mesh.geometry, mesh.matrix );

        var arrowMesh = new THREE.Mesh(arrowGeometry, new THREE.MeshBasicMaterial({ color: ColorModel.agentColors.mobileAgentColor, wireframe: true }));

        var arrow = new THREE.Object3D();
        arrow.add(arrowMesh);

        var headerArrow = new THREE.Object3D();

        headerArrow.add(arrow);
        headerArrow.name = "headerArrow";

        headerArrow.rotation.setFromVector3(
            new THREE.Vector3(
                (3 * Math.PI / 2),
                0,
                0
            ),
            "XYZ"
        );

        this.body.add(headerArrow);
    }

    /**
    * Must provide explicit accleration rate in order to accelerate. 
    * No default values. Pass a negative value in order to decelerate.
    *
    **/
    /* Can be overriden by child object to describe agent specific acceleration logic along a Lane */
    accelerate(t, accelerationRate) {

        if (accelerationRate === undefined) { throw new Error('Need to define accelerationRate'); } 
        if (this.MIN_ACCELERATION_RATE === undefined) { throw new Error('Need to define MIN_ACCELERATION_RATE'); }
        if (this.MAX_ACCELERATION_RATE === undefined) { throw new Error('Need to define MAX_ACCELERATION_RATE'); }

        // if accelerating at the provided acceleration rate, given current velocity and acceleration rate, 
        // won't cause vehicle to exceed max velocity, then accelerate at any value between min and max aceleration rate.
        if (this.v + (this.v + accelerationRate * t) <= this.MAX_VELOCITY) { 
            if (accelerationRate > this.MAX_ACCELERATION_RATE) { 
                this.a = this.MAX_ACCELERATION_RATE;
                //console.log("Max acceleration for " + this.id + " has been reached.");
            } else if (accelerationRate < this.MIN_ACCELERATION_RATE) { 
                this.a = this.MIN_ACCELERATION_RATE;
                //console.log("Max acceleration for " + this.id + " has been reached.");
            } else { 
                this.a = accelerationRate;
            }

            this.isAtPeakVelocity = false;
        } else { 
            //console.log("Cannot accelerate. Max velocity for [" + this.id + "] has been reached: " + this.v);
            this.a = 0;
            this.isAtPeakVelocity = true;
        }
    }

    updateMobileAgent(t) {
        // self explanatory. these methods are called after final agent position has been produced
        // given a current activeActionPoint if defined. These methods are placed before mobileAgent
        // position is updated in order to execute active action points with already updated position.
        this.executeActiveActionPointCallback();
        this.checkActiveCompletionChecks();
        this.updateMobileAgentPosition(t);
    }

    /* Can be overriden by child object to describe agent specific trajectory logic along a Lane or something else */
    updateMobileAgentPosition(t) {

        // Extensions of MobileAgent do not need a traversal grid and path model. updateMobileAgentPosition is called from
        // updateMobileAgent above. Traversal grids take in mobile agents with the traversal control logic below that requires
        // a traversal grid. Different mobile agents can be updated in the setVariableInterval loop in the Engine accordingly.
        if (!this) { 
            throw new Error("Mobile agent needs a traversal grid and path model");
        }

        if (this.inTransition == true) {
            if (this.counter < 1 && this.counter >= 0) {
                
                // TODO hook into mobile agent update and lane switching to implement
                // action point checking
                
                // mobile agent kinematics are applied to value of counter[ internal steering angle provided ]
                this.counter += this.getCounterDelta(t, this.reverse);

                // calculate final velocity
                this.v += (this.a * t);

                // autoCorrect velocity
                this.v = this.traversalGraph.autoCorrectValue(this.v);

                // responsible for flushing action points 
                this.laneIOGraph();

                // Updates next active actionPoint if the activeActionPointQueue is non-empty if the 
                // the current active actionPoint has been set to undefined by executeActiveActionPointCallback, or in flushRegisteredActionPoints
                this.checkActiveActionPoint();

                // Update model with final position:

                this.previousPosition = this.body.position.clone();

                var pos = this.lane.tube.parameters.path.getPointAt(this.counter);

                // get world coordinate of pos relative to cluster
                var clusterPos = this.lane.path.cluster.body.position;
                
                // increment position by position of cluster (which is the parent to the lane)
                pos.x += clusterPos.x;
                pos.y += clusterPos.y;
                pos.z += clusterPos.z;

                // the rotation of the mobileAgent is transformed below according to the geometry of the lane/tube curve
                // the orientation of the mobile agent can be further manipulated by transforming it according to the 
                // orientation of the lane's parent cluster

                    // trying to figure out why this code doesn't work for pos
                    //this.entranceNode.body.parent.updateMatrixWorld();
                    //var nodeEntrancePosition = new THREE.Vector3();
                    //nodeEntrancePosition.setFromMatrixPosition( this.entranceNode.body.matrixWorld );

                // get updated normalized position of this on catmull rom curve.
                this.body.position.copy( pos );

                var dir = this.lane.tube.parameters.path.getTangentAt(this.counter);

                // interpolation
                var segments = this.lane.tube.tangents.length;
                var pickt;

                if (this.counter >= 1 && this.reverse) {
                    pickt = this.lane.tube.tangents.length - 2;
                } else { 
                    pickt = this.counter * segments;
                }

                var pick = Math.floor( pickt );
                var pickNext = ( pick + 1 ) % segments;

                var binormal = new THREE.Vector3();
                var normal = new THREE.Vector3();

                if (this.lane.tube.binormals[ pickNext ] === undefined || this.lane.tube.binormals[ pick ] === undefined && this.inTransition == true) { 
                    throw new Error("Invalid pick and pickNext");
                }

                binormal.subVectors( this.lane.tube.binormals[ pickNext ], this.lane.tube.binormals[ pick ] );
                binormal.multiplyScalar( pickt - pick ).add( this.lane.tube.binormals[ pick ] );

                normal.copy( binormal ).cross( dir );

                var lookAt = new THREE.Vector3();
                lookAt.copy( pos ).add( dir );

                this.body.matrix.lookAt( this.body.position , lookAt , normal );
                
                this.body.rotation.setFromRotationMatrix( this.body.matrix , this.body.rotation.order );

                // correct for marginal errors around discrete set of vector [component] position values
                this.traversalGraph.autoCorrectPosition(this.body.position);
            } else {
                console.log(this);
                throw new Error(
                    "Invalid initial position for mobile agent. Velocity to high. No lane skipping!. Use switchLane(lane, counter) to jump lanes instead"
                    );
            }
        }
    }

    /**
    * Mobile agent kinematics go here [internal steering angle provided].
    */
    getCounterDelta(t, reverse) {



        var l = this.lane.curve.getLength();
        var _l = this.traversalGraph.lengthModel.getSystemLength(l);

        // calculate delta d
        var _d = (this.v * t) + (0.5 * this.a * (t * t));
        return reverse ? _d / _l * -1 : _d / _l;
    }

    // Where all state dependent lane switching logic is encapsulated
    laneIOGraph() {

        // check for end lane default behavior --> exit onto another lane or off of the road system
        if (this.counter >= 1 || this.counter < 0) {

            var counter;
            var laneExit;

            // TODO: check for lane exits here
            if (this.lane.path.laneExits.length > 0) {
                laneExit = _.find(this.lane.path.laneExits, (_laneExit) => { 
                    return _laneExit.default;
                });

                // check if lane exit found
                if (!laneExit) { throw new Error("No default lane exit found"); }

                // check if lane exit valid
                if (!laneExit.entranceLaneId || !laneExit.exitLaneId) { 
                    throw new Error("Invalid default lane exit found. Check if entranceLaneId and exitLaneId is defined");
                }

                // get next forward lane
                if (!this.reverse) { 
                    this.traversalGraph.pathsModel.getNextLane(this, this.traversalGraph.getNormalizedLaneExitCounter(laneExit.exitLaneId, this.lane.exitPosition, this));
                } 

                // get next reverse lane
                else { 
                    this.traversalGraph.pathsModel.getNextLane(this, this.traversalGraph.getNormalizedLaneExitCounter(laneExit.entranceLaneId, this.lane.entrancePosition, this));
                }
            }
        }

        // check for internal lane default behavior --> check for action points, and execute 
        // action point callbacks
        else { 

            // check and execute action point callback functions here
        }
    }

    // provide a set of actionIds that refer to actionPoints pre-plotted in the lane
    // to instantiate and enable actionPoint control logic upon traversal to the actionPoint.
    // this is used to dynamically update current lane active actionPoints, 
    // given a set of actionIds. this should be called in the Engine setVariableIntervalLoop accordingly
    updateActiveActionPoints(actionIds) { 
        if(actionIds) {
            this.activeActionPointQueue.clear();
            this.traversalGraph.pathsModel.afterLaneSwitchCallback(this, actionIds);
        }
    }

    // Updates next active actionPoint if the activeActionPointQueue is non-empty if the 
    // the current active actionPoint has been set to undefined by executeActiveActionPointCallback, or in flushRegisteredActionPoints
    checkActiveActionPoint() {

        if (this.activeActionPointQueue === undefined) {

            // create new priority queue
            this.activeActionPointQueue = !this.reverse ?
                // min heap
                new PriorityQueue({
                    comparator: function comparator(actionPoint1, actionPoint2) {
                        var actionPointCounter1 = _.isFunction(actionPoint1.counter) ? actionPoint1.counter(actionPoint1.traversalGraph) : actionPoint1.counter;
                        var actionPointCounter2 = _.isFunction(actionPoint2.counter) ? actionPoint2.counter(actionPoint2.traversalGraph) : actionPoint2.counter;                            
                        return actionPointCounter1 - actionPointCounter2;
                    }
                })

                // max heap
                : new PriorityQueue({
                    comparator: function comparator(actionPoint1, actionPoint2) {
                        var actionPointCounter1 = _.isFunction(actionPoint1.counter) ? actionPoint1.counter(actionPoint1.traversalGraph) : actionPoint1.counter;
                        var actionPointCounter2 = _.isFunction(actionPoint2.counter) ? actionPoint2.counter(actionPoint2.traversalGraph) : actionPoint2.counter;                            
                        return actionPointCounter2 - actionPointCounter1;
                    }
                });
        }

        // if non-empty activeActionPointQueue, and an undefined activeActionPoint,
        // then get next activeActionPoint ordered by the the current comparator of the activeActionPointQueue
        if (this.activeActionPointQueue.length > 0 && this.activeActionPoint === undefined) {
            this.activeActionPoint = this.activeActionPointQueue.dequeue();
        };

        // if an activeActionPoint is present (defined) for the agent, check stop flag
        if (this.activeActionPoint) {

            var activeActionPointCounter = _.isFunction(this.activeActionPoint.counter) ? this.activeActionPoint.counter(this.traversalGraph) : this.activeActionPoint.counter;

            // if mobile agent going forward
            if (!this.reverse) {

                // if the counter is greater than the activeActionPoint counter 
                if (this.counter >= activeActionPointCounter) {

                    // set position of mobile agent at counter of the activeActionPoint if stop flag is true
                    if (this.activeActionPoint.stop) { 
                        this.counter = activeActionPointCounter;
                        this.inTransition = false; // <-- must be set back to true in another action (i.e. in the completionCallback)
                    }
                }
            } 
            // if mobile agent going in reverse
            else {

                // if the counter is greater than the activeActionPoint counter  
                if (this.counter <= activeActionPointCounter) {

                    // set position of mobile agent at counter of the activeActionPoint if stop flag is true
                    if (this.activeActionPoint.stop) { 
                        this.counter = activeActionPointCounter;
                        this.inTransition = false; // <-- must be set back to true in another action (i.e. in the completionCallback)
                    }
                }
            }
        }
    }

    executeActiveActionPointCallback() {

        // synchronous action callback
        if (this.activeActionPoint) {

            var activeActionPointCounter = _.isFunction(this.activeActionPoint.counter) ? this.activeActionPoint.counter(this.traversalGraph) : this.activeActionPoint.counter;

            if (!this.reverse) { 
                if (this.counter >= activeActionPointCounter) {
                    this.activeActionPoint.callback(this);
// debugger;
                    if (this.activeActionPoint) { 
                        // add completion check to activeCompletionChecks if defined
                        if (this.activeActionPoint.completionCheck !== undefined && this.activeActionPoint.completionCallback !== undefined) {
// debugger; 
                            this.activeCompletionChecks.push(this.activeActionPoint);
                        }

                        // clear activeActionPoint after callback
                        this.activeActionPoint = undefined;
                    }
                }
            } else { 
                if (this.counter <= activeActionPointCounter) {
                    this.activeActionPoint.callback(this);
// debugger;
                    // only enters this block if activeActionPoint hasn't already been cleared by another operation that
                    // clears the activeActionPoint (i.e. switchLane, after flush and afterLaneSwitchCallback)
                    if (this.activeActionPoint) { 
                        // add completion check to activeCompletionChecks if defined
                        if (this.activeActionPoint.completionCheck !== undefined && this.activeActionPoint.completionCallback !== undefined) { 
// debugger;
                            this.activeCompletionChecks.push(this.activeActionPoint);
                        }
                        // clear activeActionPoint after callback
                        this.activeActionPoint = undefined;
                    }
                }
            }
        }
    }

    checkActiveCompletionChecks() {

        // if completion check of an actionPoint in activeCompletionChecks results to true, 
        // execute the completion callback and remove it from activeCompletionChecks.
        // else, leave it in activeCompletionChecks to be removed when completionCheck results to true
        if (this.activeCompletionChecks) {
            if (this.activeCompletionChecks.length > 0) {
                _.remove(this.activeCompletionChecks, (actionPoint) => { 
                    if (actionPoint.completionCheck(this)) { 

                        // synchronous
                        // execute actionPointCompletionCallback
                        actionPoint.completionCallback(this);
                        return true;
                    } else { 
                        return false;
                    }
                });
            } 
        }
    }

    // used to populate activeActionPointQueue upon entering a new lane, and programatically 
    // as needed for dynamic updating of actionPoints
    flushRegisteredActionPoints() {
        // if action points already in action point queue, add each point to temp array
        // clear action point queue
        // make new actionPoint queue from action points in registered array
        // add back previous action points --> to either registered array or active queue

        if (this.registeredActionPoints) { 

            if (this.activeActionPointQueue) { 

                this.activeActionPointQueue = !this.reverse ?
                    // min heap
                    new PriorityQueue({
                        comparator: function comparator(actionPoint1, actionPoint2) {
                            var actionPointCounter1 = _.isFunction(actionPoint1.counter) ? actionPoint1.counter(actionPoint1.traversalGraph) : actionPoint1.counter;
                            var actionPointCounter2 = _.isFunction(actionPoint2.counter) ? actionPoint2.counter(actionPoint2.traversalGraph) : actionPoint2.counter;                            
                            return actionPointCounter1 - actionPointCounter2;
                        }
                    })

                    // max heap
                    : new PriorityQueue({
                        comparator: function comparator(actionPoint1, actionPoint2) {
                            var actionPointCounter1 = _.isFunction(actionPoint1.counter) ? actionPoint1.counter(actionPoint1.traversalGraph) : actionPoint1.counter;
                            var actionPointCounter2 = _.isFunction(actionPoint2.counter) ? actionPoint2.counter(actionPoint2.traversalGraph) : actionPoint2.counter;                            
                            return actionPointCounter2 - actionPointCounter1;
                        }
                    });

                // define actionPoint removal function
                var _removeFn;
                // filter actionPoints from registered to active queue
                if (!this.reverse) {
                    _removeFn = function(actionPoint) { 
                        var actionPointCounter = _.isFunction(actionPoint.counter) ? actionPoint.counter(this.traversalGraph) : actionPoint.counter;

                        if (actionPoint.laneId == this.lane.id) {
                            if (actionPointCounter >= this.counter) {
                                // if actionPoint is also present in activeCompletionChecks, remove it if the ids match, and if both flushCompletionCheck flags are set to true
                                // this also removes duplicate actionPoints with the same ID and flushCompletionCheck flag, but with potentially different counters along the curve.
                                var _removeCompletionCheckFn = function(actionPoint) { 
                                    return this.id == actionPoint.id && this.flushCompletionCheck && actionPoint.flushCompletionCheck;
                                }
                                 _.remove(this.activeCompletionChecks, _removeCompletionCheckFn.bind(actionPoint));
// debugger;
                                return actionPoint; 
                            }
                        }
                    }
                } else {
                    _removeFn = function(actionPoint) { 
                        var actionPointCounter = _.isFunction(actionPoint.counter) ? actionPoint.counter(this.traversalGraph) : actionPoint.counter;

                        if (actionPoint.laneId == this.lane.id) {
                            if (actionPointCounter <= this.counter) {
                                // if actionPoint is also present in activeCompletionChecks, remove it if the ids match, and if both flushCompletionCheck flags are set to true
                                // this also removes duplicate actionPoints with the same ID and flushCompletionCheck flag, but with potentially different counters along the curve.
                                var _removeCompletionCheckFn = function(actionPoint) { 
                                    return this.id == actionPoint.id && this.flushCompletionCheck && actionPoint.flushCompletionCheck;
                                }
                                _.remove(this.activeCompletionChecks, _removeCompletionCheckFn.bind(actionPoint));
// debugger;
                                return actionPoint; 
                            }
                        }
                    }
                };

                // get activated actionPoints from registedActionPoints
                var _activatedActionPoints = _.remove(this.registeredActionPoints, _removeFn.bind(this));
// debugger;
                // add activated actionPoints to active actionPoint queue
                var _queueActivedActionPointsFn = function(actionPoint) {
                    this.activeActionPointQueue.queue(actionPoint);
                }
                _.each(_activatedActionPoints, _queueActivedActionPointsFn.bind(this));
// debugger;
                // set current activeActionPoint to undefined
                this.activeActionPoint = undefined;

                // get next action point
                this.checkActiveActionPoint();
            }
        }
    }

    // add action point to either registeredActionPoints or activeActionPoints at any given time.
    addActionPoint(actionPoint) {
        var actionPointCounter = _.isFunction(actionPoint.counter) ? actionPoint.counter(this.traversalGraph) : actionPoint.counter;

        // temporary activeActionPointQueue size check
        if (this.activeActionPointQueue.length > 10) {
            console.log("registeredActionPoints: ");
            console.log(this.registeredActionPoints);
            console.log("activeActionPointQueue: ");
            console.log(this.activeActionPointQueue);
            console.log("activeActionPoint: ");
            console.log(this.activeActionPoint);
            console.log("this: ");
            console.log(this);

            throw new Error("activeActionPointQueue size is getting high :) ");
        }

        if (this.registeredActionPoints === undefined) { 
            this.registeredActionPoints = [];
        }

        if (!this.reverse) { 
            if (actionPoint.laneId == this.lane.id
                && actionPointCounter >= this.counter) {
// debugger;
                this.activeActionPointQueue.queue(actionPoint);
            } else {
// debugger;
                this.registeredActionPoints.push(actionPoint);
            }
        } else { 
            if (actionPoint.laneId == this.lane.id 
                && actionPointCounter <= this.counter) {
// debugger; 
                this.activeActionPointQueue.queue(actionPoint);
            } else {
// debugger;
                this.registeredActionPoints.push(actionPoint);
            }
        }
    }
    
    // MobileAgent is always on a Lane as long as it is in the road system. 
    // Sets lane and counter of mobileAgent
    switchLane(lane, counter) {
        this.lane = lane;
        this.counter = counter; 

        // clear activeActionPoints 
        // filter actionPoints from registeredActionPoints to activeActionPoints
        this.flushRegisteredActionPoints();

        // hook into [after] switch lane here via callback
        this.traversalGraph.pathsModel.afterLaneSwitchCallback(this);
    }

    // should be scoped on this, but put mobileAgent in there in the meantime for controls
    reverseDirection() { 
        this.reverse = !this.reverse;

        // clear activeActionPoints 
        // filter actionPoints from registeredActionPoints to activeActionPoints
        this.flushRegisteredActionPoints();

        // hook into [after] switch lane here via callback
        this.traversalGraph.pathsModel.afterLaneSwitchCallback(this);
    }

    sendMessage(message) { 

    } 

    checkMessages() { 

    } 

    processMessage() { 

    }

    getHeading() {
        return this.body.rotation;
    } 

    setColor(color) { // <-- THREE.Color
        this.body.children[0].material.color = new THREE.Color(color);
    }
}