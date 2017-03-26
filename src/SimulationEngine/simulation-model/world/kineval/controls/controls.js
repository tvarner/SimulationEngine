export function robotApplyControls(robot) {
	// apply robot controls to robot kinematics transforms and joint angles, then zero controls
	// includes update of camera position based on base movement

	// update robot configuration from controls
	for (const x in robot.joints) {
		if (isNaN(robot.joints[x].control))
			console.warn("robot: control value for " + x +" is a nan"); // +robot.joints[x].control);

		// update joint angles
		if (robot.joints[x].control) {
			// debugger;
			robot.joints[x].angle += robot.joints[x].control;
		}

	// STENCIL: enforce joint limits for prismatic and revolute joints
		if ((robot.joints[x].type === 'prismatic') || (robot.joints[x].type === 'revolute')) {
			// ensure the angle of joint is within the interval
			if (robot.joints[x].angle > robot.joints[x].limit.upper)
				robot.joints[x].angle = robot.joints[x].limit.upper;

			if (robot.joints[x].angle < robot.joints[x].limit.lower)
				robot.joints[x].angle = robot.joints[x].limit.lower;
		}

		// clear controls back to zero for next timestep
		robot.joints[x].control = 0;
	}

	// base motion
	robot.origin.xyz[0] += robot.control.xyz[0];
	robot.origin.xyz[1] += robot.control.xyz[1];
	robot.origin.xyz[2] += robot.control.xyz[2];
	robot.origin.rpy[0] += robot.control.rpy[0];
	robot.origin.rpy[1] += robot.control.rpy[1];
	robot.origin.rpy[2] += robot.control.rpy[2];

	// move camera with robot base
	robot.view.cameraControls.object.position.x += robot.control.xyz[0];
	robot.view.cameraControls.object.position.y += robot.control.xyz[1];
	robot.view.cameraControls.object.position.z += robot.control.xyz[2];

	// make sure camera controls (THREE OrbitControls) are looking at the robot base
	robot.view.cameraControls.target.x = robot.links[robot.base].geom.position.x;
	robot.view.cameraControls.target.y = robot.links[robot.base].geom.position.y;
	robot.view.cameraControls.target.z = robot.links[robot.base].geom.position.z;

	// zero controls now that they have been applied to robot
	robot.control = {xyz: [0,0,0], rpy:[0,0,0]}; 
}