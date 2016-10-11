import React from 'react';
import './styles.css';

// Since this component is simple and static, there's no parent container for it.
const AboutPage = () => {
	return (
		<div style={{ height: '100%', width: '100%' }}>
			<div className={'about-page mast-bg-in-out'}>
				<div className={'page-header'}>About</div>
				<div className={'page-content'}>
					<div>
						More descriptive description coming soon. In the meantime, (1) click the Simulator icon, 
						(2) open the sidebar, (3) click LOAD SIMULATION, (4) select from the list of 
						example simulations to open a simulation, (5) open the sidebar and select RUN SIMULATION. 
					</div>
					<div>
						Stack: ES6, React, Redux, three.js, D3, SASS/CSS (eventually migrating to fully inline styles using Radium), Mocha, Chai, Webpack 
					</div>
					<div>Simulations:</div>
					<div>
						(1) ExampleTraversalSimulation: (Work in progress), features TraversalGraph, 
						a three.js module that provides an API for the intelligent traversal of several mobile agents that 
						must perform actions in shared space and avoid collisions along predefined paths. 
						Useful for autonomous intersection management (AIM) simulation, and general simulation
						of the movement of agents from point A to B to C, and so on. 
					</div>
					<div>
						(2) ExampleKinematicsSimulation: (Work in progress), features Fullik, 
						a Threejs module that provides fast iterative solver for Inverse Kinematics in three.js,
						as well as an API for the construction and manipulation of joint kinematic systems. 
						Fullik is a javascript conversion of a java library called Caliko (https://github.com/FedUni/caliko),
						that implements the FABRIK inverse kinematics (IK) algorithm.
					</div>
					<div>
						Next up: Adding to TraversalGraph and Fullik. Implementing ros3djs (https://github.com/RobotWebTools/ros3djs)
						module for robotics simulations in Simulation Engine.
					</div>
					<div>
						More to come. :)
					</div>
				</div>
			</div>
		</div>
	);
};

export default AboutPage;
