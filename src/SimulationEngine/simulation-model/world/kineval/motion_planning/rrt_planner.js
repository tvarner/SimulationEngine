import * as THREE from 'three';
import _m from './../utils/matrixMath';

export default class rrtPlanner {
	constructor(robot) { 
		this.robot = robot;
	}

	computeMotionPlan() {
		// exit function if RRT is not implemented
		//   start by uncommenting this.robotRRTPlannerInit 
		if (typeof this.robot_rrt_planner_init === 'undefined') {
			return;
		}

		if ((this.robot.params.update_motion_plan) && (!this.robot.params.generating_motion_plan)) {
			this.robot_rrt_planner_init();
			this.robot.params.generating_motion_plan = true;
			this.robot.params.update_motion_plan = false;
			this.robot.params.planner_state = "initializing";
		}
		if (this.robot.params.generating_motion_plan) {
			const rrt_result = this.robot_rrt_planner_iterate();
			if (rrt_result === "reached") {
				this.robot.params.update_motion_plan = false; // KE T needed due to slight timing issue
				this.robot.params.generating_motion_plan = false;
				this.robot.textbar.innerHTML = "planner execution complete";
				this.robot.params.planner_state = "complete";
				this.robot.motion_plan_traversal_index = this.robot.motion_plan.length - 1;
			}
			else this.robot.params.planner_state = "searching";
		} else if (this.robot.params.update_motion_plan_traversal || this.robot.params.persist_motion_plan_traversal) {

			if (this.robot.params.persist_motion_plan_traversal) {
				this.robot.motion_plan_traversal_index = (this.robot.motion_plan_traversal_index+1)%this.robot.motion_plan.length;
				this.robot.textbar.innerHTML = "traversing planned motion trajectory";
			} else {
				this.robot.params.update_motion_plan_traversal = false;
			}

			// random check for debugging purposes
				//makes sure robot.motion_plan_traversal_index has been properly set
			if (this.robot.motion_plan[this.robot.motion_plan_traversal_index] === undefined || this.robot.motion_plan[this.robot.motion_plan_traversal_index].vertex === undefined) {
				throw new Error("makes sure robot.motion_plan_traversal_index has been properly set");
			}

			// set robot pose from entry in planned robot path
			this.robot.origin.xyz = [
				this.robot.motion_plan[this.robot.motion_plan_traversal_index].vertex[0],
				this.robot.motion_plan[this.robot.motion_plan_traversal_index].vertex[1],
				this.robot.motion_plan[this.robot.motion_plan_traversal_index].vertex[2]
			];

			this.robot.origin.rpy = [
				this.robot.motion_plan[this.robot.motion_plan_traversal_index].vertex[3],
				this.robot.motion_plan[this.robot.motion_plan_traversal_index].vertex[4],
				this.robot.motion_plan[this.robot.motion_plan_traversal_index].vertex[5]
			];

			// KE 2 : need to move this.robot.q_names into a global parameter
			for (const x in this.robot.joints) {
				this.robot.joints[x].angle = this.robot.motion_plan[this.robot.motion_plan_traversal_index].vertex[this.robot.q_names[x]];
			}
		}
	}

	// STENCIL: uncomment and complete initialization function
	robot_rrt_planner_init() {

		// make sure the rrt iterations are not running faster than animation update
		this.robot.cur_time = Date.now();

		// flag to continue rt iterations
		this.robot.rrt_iterate = true;
		this.robot.rrt_iter_count = 0;
		// initialize this.robot.connecting to false for (RRT-Connect)
		this.robot.connecting = false;
		// generating path from q_init to _q_goal in T_ab
		this.robot.generatingPathRRTConnect = false;

		// rrt step size
		this.robot.eps = 0.4;

		// rrt* neighborhood size
		this.robot.neighborhood = this.robot.eps * 2;

		this.robot.thresh_rand = 0.4;

		// deal with margin when generate random 
		this.robot.margin_dist  = 3;

		this.robot.q_names = {};  // store mapping between joint names and q DOFs
		this.robot.q_index = [];  // store mapping between joint names and q DOFs

		this.robot.rrt_alg = 2;  // 0: basic rrt (OPTIONAL), 1: rrtConnect (REQUIRED), 2. rrtStar, 3. DFS

		this.robot.search_result = "starting";

		this.robot.search_stack = [];

		// starting base config
		// form configuration from base location and joint angles
		this.robot.q_start_config = [
			this.robot.origin.xyz[0],
			this.robot.origin.xyz[1],
			this.robot.origin.xyz[2],
			this.robot.origin.rpy[0],
			this.robot.origin.rpy[1],
			this.robot.origin.rpy[2]
		];

		for (const x in this.robot.joints) {
			// store mapping between joint names and q DOFs
				// accounts for base indices
			this.robot.q_names[x] = this.robot.q_start_config.length;
			this.robot.q_index[this.robot.q_start_config.length] = x;
			this.robot.q_start_config = this.robot.q_start_config.concat(this.robot.joints[x].angle);
		}

		// set goal configuration as the zero configuration
		let i; 
		this.robot.q_goal_config = new Array(this.robot.q_start_config.length);
		for (i=0;i<this.robot.q_goal_config.length;i++) this.robot.q_goal_config[i] = 0;

		if (this.robot.rrt_alg === 1) { 
			// initialize search tree from start configurations (RRT-based algorithms)
			this.robot.T_a = this.initRRTConnect(this.robot.q_start_config);
			// also initialize search tree from goal configuration (RRT-Connect)
			this.robot.T_b = this.initRRTConnect(this.robot.q_goal_config);

			this.robot.q_init_node = this.robot.T_a.vertices[0];
			this.robot.q_goal_node = this.robot.T_b.vertices[0];
		} else if (this.robot.rrt_alg === 2) { 
			
			this.robot.T = this.initRRTConnect(this.robot.q_start_config);
		}
	}

	robot_rrt_planner_iterate() {
		if (this.robot.rrt_iterate && (Date.now()-this.robot.cur_time > 10)) {
			this.robot.cur_time = Date.now();

			if (this.robot.rrt_alg === 0) { 
				// rrt();
			} else if (this.robot.rrt_alg === 1) { 
				this.robot.search_result = this.rrtConnect();
			} else if (this.robot.rrt_alg === 2) {
				this.robot.search_result = this.rrtStar();
			} else if (this.robot.rrt_alg === 3) {
				this.robot.search_result = this.dfsSearch();
			}

			return this.robot.search_result;
		}
	}

	// ////////////////////////////////////////////////
	// ///     STENCIL SUPPORT FUNCTIONS
	// ////////////////////////////////////////////////
	initRRTConnect(q) {
		// create tree object
		const tree = {};

		// initialize with vertex for given configuration
		tree.vertices = [];
		tree.vertices[0] = {};
		tree.vertices[0].vertex = q;
		tree.vertices[0].edges = [];
		tree.vertices[0].index = 0;

		tree.vertices[0].parent=null; // pointer to parent in graph along motion path
		tree.vertices[0].distance=0; // distance to start via path through parent
		tree.vertices[0].visited=false; // flag for whether the node has been visited
		tree.vertices[0].priority=null; // visit priority based on fscore
		tree.vertices[0].queued=false; // flag for whether the node has been queued for visiting
		tree.vertices[0].cost = 0;

		// create rendering geometry for base location of vertex configuration
		this.add_config_origin_indicator_geom(tree.vertices[0]);

		// maintain index of newest vertex added to tree
		tree.newest = 0;

		return tree;
	}

	insertTreeVertex(tree, q) {

		// create new vertex object for tree with given configuration and no edges
		const new_vertex = {};
		new_vertex.edges = [];
		new_vertex.vertex = q;
		new_vertex.index = tree.vertices.length;

		// new_vertex.parent=null; // pointer to parent in graph along motion path
		new_vertex.distance=10000; // distance to start via path through parent
		new_vertex.visited=false; // flag for whether the node has been visited
		new_vertex.priority=null; // visit priority based on fscore
		new_vertex.queued=false; // flag for whether the node has been queued for visiting

		// create rendering geometry for base location of vertex configuration
		this.add_config_origin_indicator_geom(new_vertex);

		tree.vertices.push(new_vertex);

		// maintain index of newest vertex added to tree
		tree.newest = tree.vertices.length - 1;

		// draw location on canvas
		// draw_2D_configuration(q);
	}

	insertTreeEdge(tree,q1_idx,q2_idx) {
		if (tree === undefined || q1_idx === undefined || q2_idx === undefined) { 
			// debugger;
			throw new Error("Missing valid args");
		}

		// add edge to first vertex as pointer to second vertex
		tree.vertices[q1_idx].edges.push(tree.vertices[q2_idx]);

		// add edge to second vertex as pointer to first vertex
		tree.vertices[q2_idx].edges.push(tree.vertices[q1_idx]);

		// draw edge on canvas
		// draw_2D_edge_configurations(tree.vertices[q1_idx].vertex,tree.vertices[q2_idx].vertex); 
	}

	// called to connect this.robot.T_a to this.robot.T_b
	insertTreeEdgeNodeToNode(node1, node2) {
		// add edge to first vertex as pointer to second vertex
		node1.edges.push(node2);

		// add edge to second vertex as pointer to first vertex
		node2.edges.push(node1);
	}

	// called to connect this.robot.T_a to this.robot.T_b
	insertTreeVertexNode(tree, q_node) { 
		tree.vertices.push(q_node);
	}

	// ////////////////////////////////////////////////
	// ///     RRT IMPLEMENTATION FUNCTIONS
	// ////////////////////////////////////////////////


		// STENCIL: implement RRT-Connect functions here, such as:
		//   rrt_extend
		//   rrt_connect
		//   random_config
		//   new_config
		//   nearest_neighbor
		//   normalize_joint_state
		//   find_path
		//   path_dfs

	rrtConnect() { 
		// STENCIL: implement a single iteration of an RRT-Connect algorithm.
		//   An asynch timing mechanism is used instead of a for loop to avoid 
		//   blocking and non-responsiveness in the browser.
		//
		//   Return "failed" if the search fails on this iteration.
		//   Return "succeeded" if the search succeeds on this iteration.
		//   Return "extended" otherwise.
		//
		//   Provided support functions:
		//
		//   poseIsCollision - returns whether a given configuration is in collision
		//   tree_init - creates a tree of configurations
		//   insertTreeVertex - adds and displays new configuration vertex for a tree
		//   insertTreeEdge - adds and displays new tree edge between configurations
		//   drawHighlightedPath - renders a highlighted path in a tree

		// generate random configuration in C space
		// search will be biased towards this rand configuration
		if (!this.robot.generatingPathRRTConnect) {
			if (this.robot.connecting) {

				// if this.robot.T_a was extended, attempt to connect/extend this.robot.T_b to this.robot.T_a’s new vertex
				if (this.connectRRT(this.robot.T_b, this.robot.T_a.vertices[this.robot.T_a.newest]) === "_reached") {                           

					this.robot.generatingPathRRTConnect = true;

					return "_reached";
				}

				return "extended";
			} else {
				const q_rand = this.randomConfig();

				// attempt to extend this.robot.T_a towards q_rand by fixed distance (epsilon)
				if (this.extendRRT(this.robot.T_a, q_rand) !== "trapped") {

					// begin this.connectRRT() loop in next iteration
					this.robot.connecting = true;

					return "extended";
				}

				// swap this.robot.T_a, this.robot.T_b
				const temp = this.robot.T_a;
				this.robot.T_a = this.robot.T_b;
				this.robot.T_b = temp;

				return "failed";
			}
		} else { 
			// start DFS search
			this.robot.rrt_alg = 3;
			return "starting";
		}
	}

	rrtStar() {
		if (this.robot.search_result === "starting" 
			|| this.robot.search_result === "failed" 
			|| this.robot.search_result === "extended") {

			// 1. choose a random configuration z
			let z_rand;
			if (Math.random() <= this.robot.thresh_rand) { 
				z_rand = this.robot.q_goal_config;
			} else { 
				z_rand = this.randomConfig();
			}

			// 2. find vertex in T nearest to rand configuration z
			const z_nearest = this.findNearestNeighbor(this.robot.T, z_rand);

			// 3. stear from the nearest vertex to the random configuration
			//    to define a new state, x_new, and input signal, u_new,
			const x_new = this.steer(z_nearest, z_rand); // defines: x_new, u_new, T_new

			// check if x_new is not in collision
			if (!this.robot.collisionDetector.poseIsCollision(x_new)) {

				// get vertices in T near z_new
				const Z_near = this.nearByVertices(this.robot.T, x_new);

				// choose parent of z_new to be the vertex in V with lowest path cost
				// to z_new
				const z_min = this.chooseParent(Z_near, z_nearest, x_new);

				// insert the node z_new
				this.insertNodeRRTStar(this.robot.T, z_min, x_new);

				// check if reached goal
				if (_m.vectorsEqual(this.robot.T.vertices[this.robot.T.newest].vertex, this.robot.q_goal_config)) {
					this.robot.motion_plan = this.drawHighlightedPathGraph(this.robot.T.vertices[this.robot.T.newest]);
					return "succeeded";
				}     

				// rewire the tree
				this.reWire(this.robot.T, Z_near, z_min, this.robot.T.vertices[this.robot.T.newest]);
				return "extended";
			}

			return "failed";
		} else { 
			this.robot.rrt_iterate = false;
			return "reached";
		}
	}

	insertNodeRRTStar(tree, parent_node, child_config) {
		this.insertTreeVertex(tree, child_config);
		tree.vertices[tree.newest].parent = parent_node;
		tree.vertices[tree.newest].cost = parent_node.cost + this.vertex_dist(parent_node.vertex, tree.vertices[tree.newest].vertex);
	}

	steer(source_node, dest_z) {
		// step towards dest_z
		const step_z = this.getRRTStepConfig(source_node.vertex, dest_z);
		const x_new = this.newConfig(source_node.vertex, step_z);

		// if dist from source_node to dest_z is l.t dist from source_node to x_new,
		// then return dest_z. else return x_new
		if (this.vertex_dist(source_node.vertex, dest_z) < this.vertex_dist(source_node.vertex, x_new)) { 
			return dest_z;
		}

		return x_new;
	}

	// return the vertics in the tree that are near z
	// more precisely: 

	// Reach( z, l ) = { z' of X | Dist(z, z') < l or Dist(z, z') < l }
	// and choose l(n) s.t. Reach(z, l(n)) contains a ball of volume 
	// lambda * ( log(n) / n ) ^ d, where lambda is a fixed number.
	nearByVertices(tree, z) {
		const Z_near = [];

		for (let i = 0; i < tree.vertices.length; i++) { 
			const v = tree.vertices[i];
			const v_dist_to_z = this.vertex_dist(v.vertex, z);

			if (v_dist_to_z < this.robot.neighborhood) { 
				Z_near.push(v);
			}
		}

		return Z_near;
	}

	vertex_dist(v1, v2) { 
		return Math.abs( _m.vector_magnitude( _m.vector_subtract(v1, v2) ) );
	}


	// Rather than choosing the nearest node as the parent, the RRT* considers
	// all nodes in a neighbohood of z_new and evaluates the cost of choosing each as
	// the parent. This process evaluates the total cost as the additive combination
	// of the cost associated with reaching the potential parent node, and/+ the cost
	// of the trajectory to z_new. The node that yields the lowest cost becomes the parent
	// as the new node is added to the tree. 
	chooseParent(Z_near, z_nearest, x_new) {
		if (!Z_near.length) { 
			throw new Error("No nearby vertices, Z_near");
		}

		if (!z_nearest) { 
			throw new Error("Must supply a z_nearest");
		}

		// initialize z_min (lowest cost parent) to be z_nearest
		let z_min = z_nearest;

		// initialize c_min to be cost to get to z_nearest from root
		// plus the cost to get from z_nearest to new config x_new
		let c_min = z_nearest.cost + this.vertex_dist(z_min.vertex, x_new);

		// iterate through vertices in Z_near to find the lowest cost parent
		for (let i = 0; i < Z_near.length; i++) {

			// steer from potential lowest cost parent to new config
			const _x_new = this.steer(Z_near[i], x_new);

			// if no collision going from potential parent to new config
			if (!this.robot.collisionDetector.poseIsCollision(_x_new) && _m.vectorsEqual(_x_new, x_new)) { 

				// set the cost of the new new config to be the cost to get to the parent
				// plus the cost to get from the parent to the new config
				const _x_new_cost = Z_near[i].cost + this.vertex_dist(Z_near[i].vertex, x_new);

				// if the cost to new config is less than c_min, set the parent to be the 
				// new lowest cost parent, z_min, and set c_min to the cost of the new config
				if (_x_new_cost < c_min) {
					z_min = Z_near[i];
					c_min = _x_new_cost;
				}
			}
		}

		// return the lowest cost parent
		return z_min;
	}

	// The reWire() procedure checks each node z_near in the vicinity of z_new to see
	// whether reaching z_near via z_new would achieve lower cost than doing so via 
	// its current parent. When this connection reduces the total cost associated with z_near,
	// the algorithm modifies ("rewires") the tree to make z_new the parent of z_near.
	// The RRT* then continues with the next iteration.
	reWire(tree, Z_near, z_min, z_new) {
		for (let i = 0; i < Z_near.length; i++) {
			const z_near = Z_near[i];
			const x_new = this.steer(z_new, z_near.vertex);

			if (!this.robot.collisionDetector.poseIsCollision(x_new) && _m.vectorsEqual(z_near.vertex, x_new) 
				&& z_new.cost < z_near.cost) { 
				this.reConnect(z_new, z_near, tree);
			}
		}
	}

	reConnect(child_node, parent_node, tree) {
		tree.vertices[child_node.index].parent = parent_node;
	}

	randomConfig() {
		// return random numbers between this.robot.q_start_config and this.robot.q_goal_config components

		// random base config
		let random_config = [ 
			_m.getRandomArbitrary(this.robot.q_start_config[0], this.robot.q_goal_config[0]), 
			_m.getRandomArbitrary(this.robot.q_start_config[1], this.robot.q_goal_config[1]),
			_m.getRandomArbitrary(this.robot.q_start_config[2], this.robot.q_goal_config[2]),
			_m.getRandomArbitrary(this.robot.q_start_config[3], this.robot.q_goal_config[3]),
			_m.getRandomArbitrary(this.robot.q_start_config[4], this.robot.q_goal_config[4]),
			_m.getRandomArbitrary(this.robot.q_start_config[5], this.robot.q_goal_config[5])
		];

		for (const x in this.robot.joints) {
			const joint_angle_start_config = this.robot.q_start_config[this.robot.q_names[x]];
			const joint_angle_goal_config = this.robot.q_goal_config[this.robot.q_names[x]];
			const random_joint_config = _m.getRandomArbitrary(joint_angle_start_config, joint_angle_goal_config);
			random_config = random_config.concat(random_joint_config);
		}

		return random_config;

	/*
		// generate_random_config returns q_rand as a random configuration
		// 'l' is the length of the configuration vector

		// NOTE: randomness in this is generated as: baseline + random_scale_factor * range

		var q_rand = [];

		//////////////////////////////////////////////////
		/////     Deal with the base of the robot
		//////////////////////////////////////////////////

		// some dimension of the configuration is fixed (at least in this case)
		q_rand[1] = 0; // the robot has to be on the ground
		q_rand[3] = 0; // the robot should stand upstraight
		q_rand[5] = 0; // the robot should stand upstraight

		// generate random value for x- and z- coordinate
		// this.robot_boundary is a 2x3 matrix containing the coordinate of two corners on the diagonal
		// e.g. this.robot_boundary = [[-5,0,-5],[5,0,5]];
		var corner1_x = this.robot_boundary[0][0];
		var corner2_x = this.robot_boundary[1][0];
		var edge_x_len  = (corner2_x + this.robot.margin_dist) - (corner1_x - this.robot.margin_dist); 
		var rand_x = (corner1_x - this.robot.margin_dist) + edge_x_len * Math.random();
		q_rand[0] = rand_x;

		var corner1_z = this.robot_boundary[0][2];
		var corner2_z = this.robot_boundary[1][2];
		var edge_z_len  = (corner2_z + this.robot.margin_dist) - (corner1_z - this.robot.margin_dist); 
		var rand_z = (corner1_z - this.robot.margin_dist) + edge_z_len * Math.random();
		q_rand[2] = rand_z;

		// generate random value for the orientation of robot (y)
		q_rand[4] = (2 * Math.PI) * Math.random();

		///////////////////////////////////////////////////////
		/////     Deal with the extra joints of the robot
		///////////////////////////////////////////////////////
		// similar with angle manipulation in FK
		for (var i=6; i<this.robot.q_start_config.length; i++) {
			if ((this.robot.joints[this.robot.q_index[i]].type === 'revolute') || (this.robot.joints[this.robot.q_index[i]].type === 'prismatic')) {
				// if joint is 'revolute' or 'prismatic'
				var U = this.robot.joints[this.robot.q_index[i]].limit.upper; // upper limit of current joint
				var L = this.robot.joints[this.robot.q_index[i]].limit.lower; // lower limit of current joint
				var angle_range = U - L;
				q_rand[i] = L + Math.random() * angle_range;
			}
			else
				q_rand[i] = Math.random() * 2*Math.PI;
		}

		return q_rand;
	*/
	}

	// Attempt to extend tree T to a new config q
	extendRRT(T, q, step_q, q_node) {
		// find vertex in T nearest to q
		const q_near = this.findNearestNeighbor(T, q);

		let q_new;

		// step_q is only defined if this.extendRRT() is called from this.connectRRT()
		// it is undefined when this.extendRRT() is called from iterateRRTConnect()
		if (step_q) { 
			q_new = this.newConfig(q_near.vertex, step_q);
		} else { 
			const _step_q = this.getRRTStepConfig(q_near.vertex, q);
			q_new = this.newConfig(q_near.vertex, _step_q);
		}

		// check if q is not in collisoin
		if (!this.robot.collisionDetector.poseIsCollision(q_new)) {

			// if q_new = q, then this.robot.T_a and this.robot.T_b have benn connected
			if (this.checkIfReached(q_new, q) && this.robot.connecting) {

				if (!q_node) { 
					throw new Error("Must be supplied q_node from this.connectRRT()");
				}

				// if not in collision add q to RRT with an edge from q_near to q
				// and draw the edges
				this.insertTreeVertexNode(T, q_node);
				this.insertTreeEdgeNodeToNode(q_near, q_node);

				return "_reached";
			}

			// if not in collision add q to RRT with an edge from q_near to q
			// and draw the edges
			this.insertTreeVertex(T, q_new);
			this.insertTreeEdge(T, q_near.index, T.newest);

			return "advanced";
		}

		return "trapped";
	}

	findNearestNeighbor(T, q) {
		if (T.vertices) { 
			let min_q = T.vertices[0];

			if (T.vertices.length === 1) { return min_q; }

			for (let i = 1; i < T.vertices.length; i++) { 
				const min_diff_magnitude = Math.abs( _m.vector_magnitude( _m.vector_subtract(q, min_q.vertex) ) );
				const diff_magnitude = Math.abs( _m.vector_magnitude( _m.vector_subtract(q, T.vertices[i].vertex) ) );

				if (diff_magnitude < min_diff_magnitude) { 
					min_q = T.vertices[i];
				}
			}

			return min_q;
		} else { 
			throw new Error("Tree has no vertices.");
		}
	}

	dfsSearch() {
		// TODO
		let currentNode;

		if (this.robot.search_result === "starting") { 

			currentNode = this.robot.q_init_node;
			this.robot.search_stack.push(currentNode);
			return "iterating";

		} else if (this.robot.search_result === "iterating" || this.robot.search_result === "failed") {

			// visit current node
			currentNode = this.robot.search_stack[ this.robot.search_stack.length - 1 ];
			currentNode.visited = true;

			// draw visited node
			this.add_config_origin_indicator_geom(currentNode, "#FF0000");

			// check if current node is goal node
			if (this.checkIfFound(currentNode, this.robot.q_goal_node)) {
				return "succeeded";
			}

			// add unvisited child to search queue
				// if unvisited children found, add child to this.robot.search_stack, and return "iterating"
				// if no unvisited children found, pop the search stack and return "failed"
			let nextChild;
			let i = 0;
			while(nextChild === undefined && i < currentNode.edges.length) { 
				if (!currentNode.edges[i].visited) {
					nextChild = currentNode.edges[i];
					nextChild.parent = currentNode;
					nextChild.distance = this.robot.eps;
				}
				i++;
			}

			if (nextChild !== undefined) { 
				this.robot.search_stack.push(nextChild);
				return "iterating";
			} else {
				this.robot.search_stack.pop();
				return "failed";
			}
		} else if (this.robot.search_result === "succeeded") {
			// draw path from q_goal to q_init by referencing parents;

			// stop search
			this.robot.rrt_iterate = false;
			this.robot.q_init_node.distance = 0;

			this.robot.motion_plan = this.drawHighlightedPathGraph(this.robot.q_goal_node);

			return "reached";
		} else { 
			console.info(this.robot.search_result);
			throw new Error("invalid search result");
		}
	}

	checkIfFound(node1, node2) {
		if (node1.vertex.length !== node2.vertex.length) { 
			throw new Error("vertices must be of equal length");
		}

		return _m.vectorsEqual(node1.vertex, node2.vertex);
	}

	checkIfReached(q1, q2) {
		const diff_magnitude = Math.abs( _m.vector_magnitude( _m.vector_subtract(q1, q2) ) );
		return diff_magnitude < this.robot.eps;
	}

	connectRRT(T, q) {
		if (this.robot.connecting) { 
			const q_near = this.findNearestNeighbor(T, q.vertex);
			const step_config = this.getRRTStepConfig(q_near.vertex, q.vertex);
			const s = this.extendRRT(T, q.vertex, step_config, q);
			if (s !== "advanced") { 
				this.robot.connecting = false;
			}
			
			return s;
		} else { 
			throw new Error('Only call this.connectRRT() if this.robot.connecting = true');
		}
	}

	getRRTStepConfig(source_q, dest_q) { 
		const vec_source_to_dest = _m.vector_subtract(dest_q, source_q);
		const vec_normalized = _m.vector_normalize(vec_source_to_dest);
		return _m.vector_scale(vec_normalized, this.robot.eps);
	}

	newConfig(q, q_step) { 
		return _m.vector_add(q, q_step);
	}

	add_config_origin_indicator_geom(vertex, color) {
		// create a threejs rendering geometry for the base location of a configuration
		// assumes base origin location for configuration is first 3 elements 
		// assumes vertex is from tree and includes vertex field with configuration
		const _color = color ? color : 0xffff00;

		const temp_geom = new THREE.CubeGeometry(0.1,0.1,0.1);
		const temp_material = new THREE.MeshLambertMaterial( { color: _color, transparent: true, opacity: 0.7 } );
		const temp_mesh = new THREE.Mesh(temp_geom, temp_material);
		temp_mesh.position.x = vertex.vertex[0];
		temp_mesh.position.y = vertex.vertex[1];
		temp_mesh.position.z = vertex.vertex[2];
		this.robot.view.scene.add(temp_mesh);
		vertex.geom = temp_mesh;
	}

	drawHighlightedPathGraph(current_node) {
		// traverse path back to start and draw path
		const path = [];

		// let path_length = 0; 
		let q_path_ref = current_node; 
		while (q_path_ref.distance > 0) {
			// KE: find cleaner way to draw edges

			// const edge_magnitude = Math.abs( _m.vector_magnitude( _m.vector_subtract(q_path_ref.vertex, q_path_ref.parent.vertex) ) );

			this.add_config_origin_indicator_geom(q_path_ref, "#0000FF");

			// path_length += edge_magnitude;

			path.push(q_path_ref);
			q_path_ref = q_path_ref.parent;
		}
		this.add_config_origin_indicator_geom(q_path_ref, "#0000FF");
		path.push(q_path_ref);
		path.reverse();

		return path;
	}
}
