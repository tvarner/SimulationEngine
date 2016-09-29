/**
*

Unidirectional lane between Nodes

Contains a collection of two types of segments:

(1) Bend: Standard curve [according road system design policies] between two Nodes
(2) Straight: Straight line between two Nodes
*/
import * as _ from 'lodash';
import * as THREE from 'three';
import Node from './Node'
import ColorModel from '../../world_config_models/ColorModel'

export default class Lane { 
    constructor(id, entranceNode, exitNode, path, width, safetyOffset, traversalGraph) { 
        this.init(id, entranceNode, exitNode, path, width, safetyOffset, traversalGraph);
    }

    init(id, entranceNode, exitNode, path, width, safetyOffset, traversalGraph) {
        this.id = id;
        this.width = width;
        this.safetyOffset = safetyOffset;
        this.entranceNode = entranceNode;
        this.exitNode = exitNode;
        this.entrancePosition = path.entrancePosition;
        this.exitPosition = path.exitPosition;
        this.path = path;
        this.curve = path.curve;
        this.tube = path.tube;
        this.mobileAgents = [];
        this.IOPoints = [];
        this.traversalGraph = traversalGraph;

        // Assign pathPosition attribute to the start and end Nodes, so that they can reference
        // their corresponding vertex in the geometry of the Lane curves.
        this.entranceNode.pathPosition = this.entrancePosition;
        this.exitNode.pathPosition = this.exitPosition;
    }

    getNodeEntrancePosition() {
        this.entranceNode.body.parent.updateMatrixWorld();
        
        var nodeEntrancePosition = new THREE.Vector3();
        nodeEntrancePosition.setFromMatrixPosition( this.entranceNode.body.matrixWorld );


        return nodeEntrancePosition;
    } 

    getNodeExitPosition() { 
        return this.exitNode.body.position;
    }

    addMobileAgent(mobileAgent) {
        this.mobileAgents.push(mobileAgent);
    }

    removeMobileAgent(mobileAgentId) {
        _.remove(this.mobileAgents, mobileAgent.id == mobileAgentId);
    }

    setClearanceZone(mobileAgentKinematicModel) {
        // TODO
    }

    setRequestZone(mobileAgentKinematicModel) {
        // TODO
    }

    buildActionPoints(actionPoints) { 
        for (var i = 0; i < actionPoints.length; i++) {
            
            var actionPoint = actionPoints[i];

            // get normalized position of action point on curve
            var _counter;
            if (_.isFunction(actionPoint.counter)) { 
                // the reason why action points need to be added after lanes are defined
                _counter = actionPoint.counter.call(this, this.traversalGraph);
            } else { 
                _counter = actionPoint.counter;
            }

            var actionPosition = this.curve.getPointAt(_counter);

            // create [action] node at action position
            var actionNode = new Node("action", 1, actionPosition);

            // set color of action node
            actionNode.setColor(ColorModel.nodeColors.actionNodeColor);

            // add action node to action point object
            actionPoint.actionNode = actionNode;

            // add action node to the path
            this.path.add(actionPoint.actionNode.body); 
        }

        // add collection of actionPoints to the path
        this.path.actionPoints = actionPoints;
    }
}
