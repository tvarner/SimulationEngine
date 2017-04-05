// set rectangular boundary of robot's world as min and max locations
// collision only checked in x-z plane
const robot_boundary = [[-5,0,-5],[5,0,5]];

// set spherical obstacles in robot's world
// with locations specified in homogeneous coordinates as 2D array
const robot_obstacles = []; 

robot_obstacles[0] = {}; 
robot_obstacles[0].location = [[0],[0.5],[-2],[1]]; // in homg coords
robot_obstacles[0].radius = 1.0; 
robot_obstacles[1] = {}; 
robot_obstacles[1].location = [[2],[0.5],[0],[1]]; // in homg coords
robot_obstacles[1].radius = 1.0;
robot_obstacles[2] = {}; 
robot_obstacles[2].location = [[-2],[0.5],[0],[1]]; // in homg coords
robot_obstacles[2].radius = 1.0;

const world = {
  name: 'world_local_minima',
	robot_boundary,
	robot_obstacles
};

export default world;