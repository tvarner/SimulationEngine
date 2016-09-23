import React from 'react';
import {Link} from 'react-router';
import * as THREE from 'three';
import './styles.css';

const SimulatorView = React.createClass({
	displayName: 'SimulatorView',

	componentDidMount() {
		// load and run Simulation Engine and scene here:
		this.props.onRunSimulator();
	},

	componentWillUnmount() {
		// clean up scene here:
		this.props.onNavigateFromSimulator();
		
		// exit Simulation Engine if simulator.running flag set to false
	},

	render() {
		return(
			<div id="simulator" className={this.props.simulator.sceneElement}></div>
		)
	}
})

export default SimulatorView;