PathModel Description

TraversalGraph
--> graph nodes
--> clusters

Graph nodes exist in clusters. A cluster contains one or more nodes
that describe the start and end points of internal lanes within a 
subgraph of the road system. For instance, 
a group of nodes can describe:

	(1) the points of a cubic lattice (a 3D cubic grid of nodes) in the scene

	(2) a set of camera positions that surround an object in the scene (http://www.hormone.org/hormones-and-health/the-endocrine-system)

	(3) positions of a mobileAgent inside a warehouse in the scene

	(4) a standalone node in the roadSystem with unique data, and inbound and outbound lanes
	
	etc.

Clusters serve two purposes:

	(1) describe the shape of vertices that define lanes in the scene, and specifically
	within a subgraph of the road system

	(2) a unique API (extended Node data, Lane data, Intersection data, etc.) for a
	subgraph of the road system

Nodes from different clusters can be connected by defining a segment in a path 
with a startNode and endNode from both clusters as seen below.

{
	segment: {

		// hash convention --> "camelCaseUIDOfCluster" + "_" + "camelCaseAttributeHash1" + "_" + 
		// "camelCaseAttributeHash2" + ... + "camelCaseAttributeHashK"
		// hashes are delimited with underscores --> "_"

		startNode: "lattice1_x40_y0_z0", 
		endNode: "otherCluster4_greenCar_redTires",
		type: "typeOfTheCurve",
		segments: 100, // <-- granularity of the curve should be a function of the curve length
		
		// other attributes:
		flip: true // <-- for curves of type "bend"
	}
}

All Nodes are added to the this.nodes of each cluster and MUST be hashed according to the above hash convention. 

All Nodes can therefore be stored and retrieved from one place regardless of how they are hashed by their respective cluster:

	traversalGraph.getNode("otherCluster4_greenCar_redTires")
	...
	traversalGraph.removeNode("otherCluster4_greenCar_redTires")


All vertices that decribe all paths are added to TraversalGraph.pathPositionsHashMap, with the following convention: 
"_x40_y0.2_z0.666666666666667". and can be retrieved by calling:

	traversalGraph.pathPositionsHashMap._x40_y0.2_z0.666666666666667

