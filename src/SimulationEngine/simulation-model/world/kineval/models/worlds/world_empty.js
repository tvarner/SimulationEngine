// set rectangular boundary of robot's world as min and max locations
// collision only checked in x-z plane
const robot_boundary = [[-5,0,-5],[5,0,5]];

// set spherical obstacles in robot's world
// with locations specified in homogeneous coordinates as 2D array
const robot_obstacles = []; 

const world = {
  name: 'world_empty',
	robot_boundary,
	robot_obstacles
};

export default world;
