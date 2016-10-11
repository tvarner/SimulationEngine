import React from 'react';
import Modal from './../../utilComponents/react-modal/lib/index';

import './styles.css';

export default class LoadSimulationModel extends React.Component {
	render () {
		const _onRequestClose = this.props.clearActiveModal;

		return (
			<Modal
				className={'save-simulation-modal'}
				overlayClassName={'save-simulation-modal-overlay'}
				isOpen={true}
				onRequestClose={_onRequestClose}
			>
				<h1>Save Simulation</h1>
				<div>TODO ;)</div>
				<button onClick={this.props.clearActiveModal}>Close</button>
			</Modal>
		);
	}
}