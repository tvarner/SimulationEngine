export function setPoseSetpoint(robot, pose_id) {
	if (pose_id < 1)
		robot.textbar.innerHTML = "setpoint is preset zero pose";
	else
		robot.textbar.innerHTML = "setpoint is user defined pose "+pose_id;
	robot.params.setpoint_id = pose_id;
	for (const x in robot.joints) {
		robot.params.setpoint_target[x] = robot.setpoints[pose_id][x];
	}
}

export function assignPoseSetpoint(robot, pose_id) {
	if ((pose_id < 1)||(pose_id>9)) {
		console.warn("robot: setpoint id must be between 1 and 9 inclusive");
	} else {
		robot.textbar.innerHTML = "assigning current pose to setpoint " + pose_id;
	}
	
	for (const x in robot.joints) {
		robot.setpoints[pose_id][x] = robot.joints[x].angle;
	}
}

export function executeClock(robot) {
	// if update not requested, exit routine
	if (!robot.params.update_pd_clock) return; 

	const curdate = new Date();
	for (const x in robot.joints) {
		robot.params.setpoint_target[x] = curdate.getSeconds()/60*2*Math.PI;
	}
}

export function executeSetpoints(robot) {
	// if update not requested, exit routine
	if (!robot.params.update_pd_dance) return; 

	const setpoint_EPSILON = 0.005; // the threshold for setpoint
	let setpoint_flag = true; // indicator of whether the desired setpoint has been reached
	let error = 0; // the error of the current state and the desired setpoint

	for (const x in robot.joints) {
		// for each joint of the robot
		
		// compute the error and update the flag
		error = robot.joints[x].angle - robot.params.setpoint_target[x];
		if (Math.abs(error) > setpoint_EPSILON)
			setpoint_flag = false;
	}

	if (setpoint_flag) {
		// current setpoint reached, go for the next one
		// if current setpoint is the end of the sequence, start over again
		robot.params.dance_pose_index += 1;
		robot.params.dance_pose_index = robot.params.dance_pose_index % robot.params.dance_sequence_index.length;
	}

	for (const x in robot.joints) { 
		// retrieve the setpoints initialized in this.setpoints
		const sequence_index = robot.params.dance_sequence_index[robot.params.dance_pose_index];
		robot.params.setpoint_target[x] = robot.setpoints[sequence_index][x];
	}
}

export function robotPdControl (robot) {
	/*
	RECALL:
		robot.joints[x].servo.p_gain = 0; 
		robot.joints[x].servo.p_desired = 0;
		robot.joints[x].servo.d_gain = 0; 
	*/

	// if update not requested, exit routine
	if ((!robot.params.update_pd)&&(!robot.params.persist_pd)) return; 

	robot.params.update_pd = false; // if update requested, clear request and process setpoint control

	let error = 0;
	for (const x in robot.joints) {
		// for each joint of the robot 

		// update servo.p_desired
		robot.joints[x].servo.p_desired = robot.params.setpoint_target[x];

		// conpute the P term
		error = robot.joints[x].servo.p_desired - robot.joints[x].angle;
		robot.joints[x].control += robot.joints[x].servo.p_gain * error;
	}
}