import _m from './../utils/matrixMath';
import numeric from './../utils/numeric';

// ////////////////////////////////////////////////
// ///     COLLISION DETECTION FUNCTIONS
// ////////////////////////////////////////////////

	/*-- |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/|

		KinEval | Kinematic Evaluator | collision detection

		Implementation of robot kinematics, control, decision making, and dynamics 
			in HTML5/JavaScript and threejs
		 
		@author ohseejay / https://github.com/ohseejay / https://bitbucket.org/ohseejay

		Chad Jenkins
		Laboratory for Perception RObotics and Grounded REasoning Systems
		University of Michigan

		License: Creative Commons 3.0 BY-SA

	|\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| --*/

	// KE: merge collision test into FK
	// KE: make FK for a configuration and independent of current robot state


export function testCollision(robot, q) { 
	if (!robot.collisionDetector) {
		robot.collisionDetector = new collisionDetector(robot);
	}
	return robot.collisionDetector.poseIsCollision(q);
}

class collisionDetector {
	constructor(robot) { 
		this.robot = robot;
	} 

	poseIsCollision(q) {
		// perform collision test of robot geometry against planning world 

		// test base origin (not extents) against world boundary extents
		if ((q[0]<this.robot.world.robot_boundary[0][0])
			||(q[0]>this.robot.world.robot_boundary[1][0])
			||(q[2]<this.robot.world.robot_boundary[0][2])
			||(q[2]>this.robot.world.robot_boundary[1][2])) {

			return this.robot.base;
		}

		// traverse robot kinematics to test each body for collision
		// robot_collision_forward_kinematics() is implemented as an individual helper function below
		return this.robot_collision_forward_kinematics(q);
	}

	robot_collision_forward_kinematics(q) {
		// this function takes the configuration vector 'q' as input argument
		// q[0], q[1], q[2] are for translation of the robor base
		// q[3], q[4], q[5] are for rotation of the robor base

		// transform the robot base into world frame using FK
		const Rx_world_base = _m.generate_rotation_matrix_X(q[3]);
		const Ry_world_base = _m.generate_rotation_matrix_Y(q[4]);
		const Rz_world_base = _m.generate_rotation_matrix_Z(q[5]);
		// Note the order of multiplication, R = Rz*Ry*Rx
		const R_world_base = _m.matrix_multiply(_m.matrix_multiply(Rz_world_base, Ry_world_base), Rx_world_base);
		// generate translation matric
		const T_world_base = _m.generate_translation_matrix(q[0], q[1], q[2]);
		
		const xform_world_base = _m.matrix_multiply(T_world_base, R_world_base);

		// traverse through the robot hierachy using FK
		// NOTE: code involved to handle ROS
		if (this.robot.links_geom_imported) {
			const offset_xform = _m.matrix_multiply(_m.generate_rotation_matrix_Y(-Math.PI/2), _m.generate_rotation_matrix_X(-Math.PI/2));
			const origin_xform_convert = _m.matrix_multiply(xform_world_base, offset_xform);
			return this.traverse_collision_forward_kinematics_link(this.robot.links[this.robot.base], origin_xform_convert, q);
		} else {
			return this.traverse_collision_forward_kinematics_link(this.robot.links[this.robot.base], xform_world_base,q);
		}
	}

	traverse_collision_forward_kinematics_link(link, mstack, q) {
		// test collision by transforming obstacles in world to link space
	/*
		mstack_inv = matrix_invert_affine(mstack);
	*/
		const mstack_inv = numeric.inv(mstack);

		let i;
		let j;

		// test each obstacle against link bbox geometry by transforming obstacle into link frame and testing against axis aligned bounding box
		//for (j=0;j<this.robot.world.robot_obstacles.length;j++) { 
		for (j in this.robot.world.robot_obstacles) { 

			const obstacle_local = _m.matrix_multiply(mstack_inv,this.robot.world.robot_obstacles[j].location);

			// assume link is in collision as default
			let in_collision = true; 

			// if obstacle lies outside the link extents along any dimension, no collision is detected
			if (
				(obstacle_local[0][0]<(link.bbox.min.x-this.robot.world.robot_obstacles[j].radius))
				||
				(obstacle_local[0][0]>(link.bbox.max.x+this.robot.world.robot_obstacles[j].radius))
			)
					in_collision = false;
			if (
				(obstacle_local[1][0]<(link.bbox.min.y-this.robot.world.robot_obstacles[j].radius))
				||
				(obstacle_local[1][0]>(link.bbox.max.y+this.robot.world.robot_obstacles[j].radius))
			)
					in_collision = false;
			if (
				(obstacle_local[2][0]<(link.bbox.min.z-this.robot.world.robot_obstacles[j].radius)) 
				||
				(obstacle_local[2][0]>(link.bbox.max.z+this.robot.world.robot_obstacles[j].radius))
			)
					in_collision = false;

			// if obstacle lies within link extents along all dimensions, a collision is detected and return true
			if (in_collision)
				return link.name;
		}

		// recurse child joints for collisions, returning true if child returns collision
		if (typeof link.children !== 'undefined') { // return if there are no children
			let local_collision;
			//for (i=0;i<link.children.length;i++) {
			for (i in link.children) {
				local_collision = this.traverse_collision_forward_kinematics_joint(this.robot.joints[link.children[i]],mstack,q);
				if (local_collision) {
					return local_collision;
				}
			}
		}

		// return false, when no collision detected for this link and children 
		return false;
	}

	traverse_collision_forward_kinematics_joint(joint, mat_stack, q) {
		// traverse_collision_forward_kinematics_joint traverses the robot joints in the hierachy, similar to FK

		// //////////////////////////////////////////////////////////////
		//  Step1: compute the transform matrix from parent to this_joint
		// //////////////////////////////////////////////////////////////

		const Rx_parent_joint = _m.generate_rotation_matrix_X(joint.origin.rpy[0]);
		const Ry_parent_joint = _m.generate_rotation_matrix_Y(joint.origin.rpy[1]);
		const Rz_parent_joint = _m.generate_rotation_matrix_Z(joint.origin.rpy[2]);
		//  Note the order of multiplication, R = Rz*Ry*Rx
		const R_parent_joint  = _m.matrix_multiply(_m.matrix_multiply(Rz_parent_joint, Ry_parent_joint), Rx_parent_joint);
		const T_parent_joint  = _m.generate_translation_matrix(joint.origin.xyz[0], joint.origin.xyz[1], joint.origin.xyz[2]);
		
		//  local transformation matrix
		const xform_parent_joint = _m.matrix_multiply(T_parent_joint, R_parent_joint);

		// //////////////////////////////////////////////
		//  Step2: compute the rotaion of thie joint axis
		// //////////////////////////////////////////////
		const joint_axis = [joint.axis[0], joint.axis[1], joint.axis[2]];
		const joint_angle = q[this.robot.q_names[joint.name]];
		
		let joint_xform;

		if ((typeof joint.type === 'undefined') || (joint.type === 'revolute') || (joint.type === 'continuous')) {
			// we consider continuous joint as default
			let qtrn = _m.quaternion_from_axisangle(joint_axis, joint_angle);
			qtrn = _m.quaternion_normalize(qtrn);
			joint_xform = _m.quaternion_to_rotation_matrix(qtrn);
		} else if (joint.type === 'prismatic') {
			// only translation matters
			joint_xform = _m.generate_translation_matrix(
				joint_angle*joint_axis[0], 
				joint_angle*joint_axis[1], 
				joint_angle*joint_axis[2]
			);
		} else {
			// fixed joint
			joint_xform = [
				[1, 0, 0, 0],
				[0, 1, 0, 0],
				[0, 0, 1, 0],
				[0, 0, 0, 1]
			];
		}

		// ///////////////////////////////////////////////////////////////////
		// Step3: compute the top of the matrix stack and continue traversing
		// ///////////////////////////////////////////////////////////////////
		// add local xform and rotation to the top of matrix stack
		const mat_stack_top = _m.matrix_multiply(_m.matrix_multiply(mat_stack, xform_parent_joint), joint_xform);

		// traverse child link with the current_xform being top of matrix stack 
		return this.traverse_collision_forward_kinematics_link(this.robot.links[joint.child], mat_stack_top, q);
	}
}
