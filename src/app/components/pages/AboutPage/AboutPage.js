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
						bridging React, Redux, and three.js. It also contains an API, SimulationEngine, 
						that provides hooks into an explicit control flow of the lifecycle of a 3D simulation or animation.
						This allows seamless uni-directional control flow between React components and three.js
						scenes when building a complete application flow.<br/><br/>

						The goal of Simulation Engine is to provide a framework for the rapid development 
						of interactive 3D web applications built over three.js. Boilerplate code 
						that is not involved in the simulation logic is abstracted away, allowing
						the designer to focus on the code most salient to the system being simulated.<br/><br/>

						3D simulations, which can take the form of video-games, 3D model editors, 
						simulations of factory floors, etc., and can be loaded, ran, and saved within a well defined front-end
						framework that can also be used to extrapolate and visualize simulation data (using D3 for example).
					</div>
					<div>
						<span style={{fontWeight: 'bold'}}>Stack:</span> ES6, React, Redux, three.js, D3, SASS/CSS (eventually migrating to fully inline styles using Radium), Mocha, Chai, Webpack, and others.<br/>
						<a href={'https://github.com/tvarner/SimulationEngine'} style={{fontWeight: 'bold'}}>github</a>
					</div>
					<div>
						<span style={{fontWeight: 'bold', fontSize: 'large'}}>Instructions:</span>
						<ol>
							<li>Click the SIMULATOR icon from the Home Page. Or open the sidebar and select SIMULATOR.</li>
							<li>Once simulator is loaded, click LOAD SIMULATION.</li>
							<li>Select from the list of example simulations to open a simulation. NOTE: Simulations may take a moment to load.</li>
							<li>Open the sidebar and select RUN SIMULATION.</li>
							<li>Utilize STOP SIMULATION, CLEAR SIMULATION, and SAVE SIMULATION accordingly.</li>
							<li>You can also navigate away from the simulator page preserving the state of the simulation. 
							Click RUN SIMULATION to start the simulation again.</li>
							<li>NOTE: The DATA VIEW is a WIP and currently does not load.</li>
						</ol> 
					</div>
					<div style={{fontWeight: 'bold', fontSize: 'large'}}>Simulations:</div>
					<div>
						<span style={{fontWeight: 'bold'}}>ExampleTraversalSimulation:</span> (Work in progress), features TraversalGraph, 
						a three.js module that provides an API for the intelligent traversal of several mobile agents that 
						must perform actions in shared space and avoid collisions along predefined paths. 
						Useful for autonomous intersection management (AIM) simulation, and general simulation
						of the movement of agents in a traversal system.<br/><br/> The traversal system is simply defined 
						by a graph with nodes at 3D coordinates connected by edges with specified curve types. Agents
						perform actions that update the state space when traversing over specified points, called Action Points,
						along an edge. In this example, when agents traverse over the orange Action Points, they trigger
						an event to change to a random color. This action could take a number of forms, from a switch of lanes
						to a grasp operation performed by a mobile robot.
					</div>
					<div>
						<span style={{fontWeight: 'bold'}}>ExampleKinematicsSimulation:</span> (Work in progress), features Fullik (forked from https://github.com/lo-th), 
						a three.js module that provides a fast iterative solver for inverse kinematics in three.js,
						as well as an API for the construction of joint kinematic systems. Minor refactors, linted, and made 
						ES6 compatible. Fullik is a javascript conversion of a java library called Caliko (https://github.com/FedUni/caliko),
						that implements the FABRIK (Forward and Backward Reaching) inverse kinematics (IK) algorithm 
						(https://www.researchgate.net/publication/220632147_FABRIK_A_fast_iterative_solver_for_the_Inverse_Kinematics_problem).
					</div>
					<div><span style={{fontWeight: 'bold', fontSize: 'large'}}>Next up:</span>
						<ul>
							<li>Update styles</li>
							<li>Adding to TraversalGraph and Fullik.</li>
							<li>Implement discrete event simulation modeling framework example</li>
							<li>Simulation saving with Firebase.</li> 
							<li>Implementing ros3djs module (https://github.com/RobotWebTools/ros3djs)
							for robotics simulations.</li>
							<li>Creating more example simulations.</li>
						</ul>
					</div>
					<div style={{marginBottom: '10%'}}>
						Much more to do. Much more to come. :)
					</div>
				</div>
			</div>
		</div>
	);
};

export default AboutPage;
