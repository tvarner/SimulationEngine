import rrtPlanner from './rrt_planner';

// ////////////////////////////////////////////////
// ///     MOTION PLANNING FUNCTIONS
// ////////////////////////////////////////////////


	/* -- |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/|

		KinEval | Kinematic Evaluator | RRT motion planning

		Implementation of robot kinematics, control, decision making, and dynamics 
			in HTML5/JavaScript and threejs
		 
		@author ohseejay / https://github.com/ohseejay / https://bitbucket.org/ohseejay

		Chad Jenkins
		Laboratory for Perception RObotics and Grounded REasoning Systems
		University of Michigan

		License: Creative Commons 3.0 BY-SA

	|\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| |\/| --*/

	// ////////////////////////////////////////////////
	// ///     RRT MOTION PLANNER
	// ////////////////////////////////////////////////

	// STUDENT: 
	// compute motion plan and output into robot_path array 
	// elements of robot_path are vertices based on tree structure in tree_init() 
	// motion planner assumes collision checking by kineval.poseIsCollision()

	/* 

	KE 2 : Notes:
	   - Distance computation needs to consider modulo for joint angles
	   - robot_path[] should be used as desireds for controls
	   - Add visualization of configuration for current sample
	*/

	/*
	STUDENT: reference code has functions for:

	*/


export function computeMotionPlan(robot) { 
	if (!robot.planner) {
		robot.planner = new rrtPlanner(robot);
	}

	robot.planner.computeMotionPlan();
}
