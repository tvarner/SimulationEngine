import React from 'react';
import './styles.css';

const SimulatorView = React.createClass({
	displayName: 'SimulatorView',

	componentDidMount() {
		// load and run Simulation Engine and scene here:
		this.props.onPlaySimulator();
	},

	componentWillUnmount() {
		// clean up scene here:
		this.props.onNavigateFromSimulator();
		
		// debugger;
		// exit Simulation Engine if simulator.running flag set to false
	},

	render() {
		return(
			<div id={this.props.simulationEngine.sceneElement} className={this.props.simulationEngine.sceneElement} />
		);
	}
});

export default SimulatorView;