import React, {Component} from 'react';

export default class SimulationView extends Component {
	render() { 
		return (
			<div>
				Simulation View!
				<button
					onClick={e => {
						e.preventDefault();
						this.props.startSimulation();
					}}
				>
					Start Simulation
				</button>
			</div>
		);
	}
}