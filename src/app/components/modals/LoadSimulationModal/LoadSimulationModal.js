import React from 'react';
import Modal from './../../utilComponents/react-modal/lib/index';

import './styles.css';

export default class LoadSimulationModel extends React.Component {
	constructor () {
		super();
	}

	render () {
		return (
			<Modal
				className={'load-simulation-modal'}
				overlayClassName={'load-simulation-modal-overlay'}
				isOpen={true}
				onRequestClose={this.props.clearActiveModal}
			>
				<h1>Load Simulation</h1>
				<a onClick={this.props.startSimulation.bind(this, 'Example Kinematics Simulation')}>Example Kinematics Simulation</a>
				<a onClick={this.props.startSimulation.bind(this, 'Example Traversal Simulation')}>Example Traversal Simulation</a>
				<a onClick={this.props.startSimulation.bind(this, 'Example Robotics Simulation')}>Example Robotics Simulation</a>
				<button onClick={this.props.clearActiveModal}>Close</button>
			</Modal>
		);
	}
}