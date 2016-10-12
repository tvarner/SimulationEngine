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
						SimulationEngine Starter Kit provides a javascript based simulation modeling framework
						built over React, Redux, three.js, D3, SASS (soon to be replaced with inline styles), 
						ES6, Webpack, Babel, and other tools. It also contains an API, SimulationEngine, 
						that provides hooks into an explicit control flow of the lifecycle of a simulation.
						This allows seamless uni-directional control flow between React components and three.js
						scenes when building the application flow. 

						The goal of Simulation Engine is to provide a framework for the rapid development 
						of interactive 3D web applications built over three.js. Boilerplate code 
						that is not a part of the simulation logic is astracted away, allowing
						the designer to focus on the code that is most salient to the system being simulated.

						3D simulations, which can take the form of video-games, 3D model editors, 
						simulations of factory floors, etc., can be loaded, ran, and saved within a well defined front-end
						framework that can also be used to extrapolate and visualize simulation data.
					</div>
					<div>
						Instructions:
						<ol>
							<li>Click the SIMULATOR icon from the Home Page. Or open the sidebar and select SIMULATOR.</li>
							<li>Once simulator is loaded, click LOAD SIMULATION.</li>
							<li>Select from the list of example simulations to open a simulation. NOTE: Simulations may take a moment to load.</li>
							<li>Open the sidebar and select RUN SIMULATION.</li>
							<li>Utilize STOP SIMULATION, CLEAR SIMULATION, and SAVE SIMULATION accordingly.</li>
							<li>You can also navigate away from the simulator page preserving the state of the simulation. 
							Click RUN SIMULATION to start the simulation again.</li>
							<li>NOTE: The DATA VIEW is a work in progress and currently does not load.</li>
						</ol> 
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
						of the movement of agents in a traversal system defined by a graph with nodes at 3D coordinates. 
					</div>
					<div>
						(2) ExampleKinematicsSimulation: (Work in progress), features Fullik (forked from https://github.com/lo-th), 
						a three.js module that provides a fast iterative solver for inverse kinematics in three.js,
						as well as an API for the construction of joint kinematic systems. Minor refactors, linted, and made 
						ES6 compatible. Fullik is a javascript conversion of a java library called Caliko (https://github.com/FedUni/caliko),
						that implements the FABRIK (Forward and Backward Reaching) inverse kinematics (IK) algorithm 
						(https://www.researchgate.net/publication/220632147_FABRIK_A_fast_iterative_solver_for_the_Inverse_Kinematics_problem).
					</div>
					<div>Next up: 
						<ul>
							<li>Adding to TraversalGraph and Fullik.</li>
							<li>Simulation saving.</li> 
							<li>Implementing ros3djs module (https://github.com/RobotWebTools/ros3djs)
							for robotics simulations in Simulation Engine.</li>
							<li>Creating more example simulations.</li>
						</ul>
					</div>
					<div style={{marginBottom: '10%'}}>
						More to come. :)
					</div>
				</div>
			</div>
		</div>
	);
};

export default AboutPage;
