/*
* Traversal grid intersection <-- defined within cubic lattice
*/

export default class Intersection { 
    constructor(intersectionPoint) { 
        this.init(intersectionPoint)
    }

    init(intersectionPoint) {
        // init reservation grid
        this.intersectionPoint = intersectionPoint;
        this.inboundLanes = [];
        this.outboundLanes = [];
        this.parseIntersectionPointHash(intersectionPoint);
    }

    parseIntersectionPointHash(intersectionPoint) { 
        // add inbound and outbound lanes
    }

    addInboundLane(lane) { 
        this.inboundLanes.push(lane);
    }

    addOutboundLane(lane) { 
        this.outboundLanes.push(lane);
    }

    buildIntersectionPaths() {

    }
}