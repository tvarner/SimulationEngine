import _m from './../utils/matrixMath';

export function buildFKTransforms(robot) {
	traverseFKBase(robot);
}

function traverseFKBase(robot) {
	// compute local transform (from world):
	const r_mat_x = _m.generate_rotation_matrix_X(robot.origin.rpy[0]);
	const r_mat_y = _m.generate_rotation_matrix_Y(robot.origin.rpy[1]);
	const r_mat_z = _m.generate_rotation_matrix_Z(robot.origin.rpy[2]);
	const r_mat = _m.matrix_multiply(_m.matrix_multiply(r_mat_z, r_mat_y), r_mat_x);
	const t_mat = _m.generate_translation_matrix(robot.origin.xyz[0], robot.origin.xyz[1], robot.origin.xyz[2]);
	robot.origin.xform = _m.matrix_multiply(t_mat, r_mat); 

	// compute heading direction (z-axis), starting from local, then transform into world
	const local_heading = [[0],[0],[1],[1]];
	robot.heading = _m.matrix_multiply(robot.origin.xform, local_heading);

	// compute lateral direction (x-axis), starting from local, then transform into world
	const local_lateral = [[1],[0],[0],[1]];
	robot.lateral = _m.matrix_multiply(robot.origin.xform, local_lateral);   

	// handle ROS conversion
	if (robot.links_geom_imported) {
		const offset_xform = _m.matrix_multiply(_m.generate_rotation_matrix_Y(-Math.PI/2),_m.generate_rotation_matrix_X(-Math.PI/2));
		const ros_origin_xform = _m.matrix_multiply(robot.origin.xform, offset_xform);
		traverseFKLink(robot, robot.links[robot.base], ros_origin_xform);
	}
	else {
		traverseFKLink(robot, robot.links[robot.base], robot.origin.xform);
	}
}

function traverseFKLink(robot, link, parent_mat) {
	// set link xform from parent joint
	link.xform = _m.matrix_copy(parent_mat);

	for (const joint in link.children) { 
		traverseFKJoint(robot, robot.joints[link.children[joint]], link.xform);
	}
}

function traverseFKJoint(robot, joint, parent_mat) {
	// compute local transform:
	const r_mat_x = _m.generate_rotation_matrix_X(joint.origin.rpy[0]);
	const r_mat_y = _m.generate_rotation_matrix_Y(joint.origin.rpy[1]);
	const r_mat_z = _m.generate_rotation_matrix_Z(joint.origin.rpy[2]);
	const r_mat = _m.matrix_multiply(_m.matrix_multiply(r_mat_z, r_mat_y), r_mat_x);
	const t_mat = _m.generate_translation_matrix(joint.origin.xyz[0], joint.origin.xyz[1], joint.origin.xyz[2]);
	let r_mat_control;
	let q;

	// compute the rotation matrix according to axis of joint
	if ((typeof joint.type === 'undefined') || (joint.type === 'revolute') || (joint.type === 'continuous')) {
		// we consider continuous joint as default
		q = _m.quaternion_from_axisangle(joint.axis, joint.angle);
		q = _m.quaternion_normalize(q);
		r_mat_control = _m.quaternion_to_rotation_matrix(q);
	} else if (joint.type === 'prismatic') {
		// only translation matters
		r_mat_control = _m.generate_translation_matrix(joint.angle * joint.axis[0], joint.angle * joint.axis[1], joint.angle * joint.axis[2]);
	} else {
		// fixed joint
		r_mat_control = [
			[1, 0, 0, 0],
			[0, 1, 0, 0],
			[0, 0, 1, 0],
			[0, 0, 0, 1]
		];
	}

	// compute joint to world transform:
	joint.xform = _m.matrix_multiply(_m.matrix_multiply(_m.matrix_copy(parent_mat), _m.matrix_multiply(t_mat, r_mat)), r_mat_control);

	if (joint.child) { 
		traverseFKLink(robot, robot.links[joint.child], joint.xform);
	}
}
