import _m from './../utils/matrixMath';

export function randomizeIKtrial(robot) {
	// update time from start of trial
	const cur_time = new Date();
	robot.params.trial_ik_random.time = cur_time.getTime()-robot.params.trial_ik_random.start.getTime();

	// STENCIL: see instructor for random time trial code
}

export function iterateIK(robot) {
	const endeffector_target_world = robot.params.ik_target;
	const endeffector_joint = robot.endeffector.frame;
	const endeffector_position_local = robot.endeffector.position;

	// endeffector_target_world:   object { position: Array[4], orientation: Array[3] }
	// endeffector_joint:          name (string) of the endeffector joint, e.g. "forearm_right_yaw"
	// endeffector_position_local: a 4x1 column vector
	const IK_chain = []; // chain of links in reverse-hierachy order
	let this_joint = endeffector_joint;

	// reversely traverse the hierachy from endeffector to base
	let next_is_base = false;

	while (!next_is_base) {
		IK_chain.push(this_joint);

		if (robot.joints[this_joint].parent !== robot.base) {
			this_joint = robot.links[robot.joints[this_joint].parent].parent; // go to the parent joint of this joint (thru the corresponding link)
		} else {
			next_is_base = true;
		}
	}
	
	// reverse the IK_chain for future use
	const IK_chain_forward = IK_chain.slice(); // copy array
	IK_chain_forward.reverse();

	// get the world position of the endeffector
	robot.endeffector_world = _m.matrix_multiply(robot.joints[endeffector_joint].xform, endeffector_position_local);

	// get target Cartesian position in the world
	robot.target_world = _m.matrix_copy(endeffector_target_world.position); // just a copy

	// create the Jacobian matrices
	const J = [[],[],[],[],[],[]]; // initialize the J matrix to be of size 6xN
	for (let i=0; i<IK_chain_forward.length; i++) {
		// compute the origin the current joint in world frame
		// [[0],[0],[0],[1]] is the origin (0,0,0) in homogrneous form
		const joint_origin_world = _m.matrix_multiply(robot.joints[ IK_chain_forward[i] ].xform, [[0],[0],[0],[1]]);
		
		// compute the axis of current joint in world frame
		// joint_axis_local is the rotation axis in local frame
		const joint_axis_local = [
			[ robot.joints[ IK_chain_forward[i] ].axis[0] ],
			[ robot.joints[ IK_chain_forward[i] ].axis[1] ],
			[ robot.joints[ IK_chain_forward[i] ].axis[2] ],
			[ 0 ]
		];

		const joint_axis_world = _m.matrix_multiply(robot.joints[ IK_chain_forward[i] ].xform, joint_axis_local);
		
		// angular velocity
		J[3][i] = joint_axis_world[0][0]; 
		J[4][i] = joint_axis_world[1][0]; 
		J[5][i] = joint_axis_world[2][0]; 

		// compute the displacement vector in the local frame (same as that in the world frame)
		const vec_origin_endeffector = _m.vector_subtraction(robot.endeffector_world, joint_origin_world);

		// compute linear velocity
		// NOTE: J_cross is a row vector
		const J_cross = _m.vector_cross(joint_axis_world, vec_origin_endeffector);

		// linear velocity
		J[0][i] = J_cross[0]; 
		J[1][i] = J_cross[1]; 
		J[2][i] = J_cross[2];

		// deal with 'prismatic joint'
		if (robot.joints[ IK_chain_forward[i] ].type === 'prismatic') {
			J[0][i] = joint_axis_world[0][0]; 
			J[1][i] = joint_axis_world[1][0]; 
			J[2][i] = joint_axis_world[2][0];
			// angular velocity is fixed to be zero
			J[3][i] = 0;
			J[4][i] = 0; 
			J[5][i] = 0; 
		}
	}
	
	// retrieve the rotation part of the endeffector.xform 
	const xform_matrix = _m.matrix_copy(robot.joints[endeffector_joint].xform);
	const euler_angle = _m.angle_from_rotation_matrix(xform_matrix);
	
	// compute the error vector from current state to desired state
	const delta_position = _m.vector_subtraction(endeffector_target_world.position, robot.endeffector_world); // column vector
	const delta_orientation = _m.vector_subtraction(endeffector_target_world.orientation, euler_angle); // column vector
	
	let dx;

	if (robot.params.ik_orientation_included) {
		// orientation considered
		dx = [
			[ delta_position[0][0] ],
			[ delta_position[1][0] ],
			[ delta_position[2][0] ],
			[ delta_orientation[0] ],
			[ delta_orientation[1] ],
			[ delta_orientation[2] ]
		];
	} else {
		// orientation not considered
		dx = [
			[ delta_position[0][0] ],
			[ delta_position[1][0] ],
			[ delta_position[2][0] ],
			[ 0 ],
			[ 0 ],
			[ 0 ]
		];        
	}

	let dq;

	// compute dq using pseudoinverse or transpose of the Jacobian
	if (robot.params.ik_pseudoinverse) {
		dq = _m.matrix_multiply(_m.matrix_pseudoinverse(J), dx);
	} else {
		dq = _m.matrix_multiply(_m.matrix_transpose(J), dx);
	}

	// update joint angles
	for (let i = 0; i < IK_chain_forward.length; i++) {
		robot.joints[ IK_chain_forward[i] ].control += robot.params.ik_steplength * dq[i][0];
	}
}