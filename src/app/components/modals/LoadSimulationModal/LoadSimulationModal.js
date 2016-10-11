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
				<a onClick={this.props.startSimulation.bind(null, 'Example Kinematics Simulation')}>Example Kinematics Simulation</a>
				<a onClick={this.props.startSimulation.bind(null, 'Example Traversal Simulation')}>Example Traversal Simulation</a>
				<button onClick={this.props.clearActiveModal}>Close</button>
			</Modal>
		);
	}
}