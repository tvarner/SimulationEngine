import React from 'react';
import Modal from '../../utilComponents/react-modal/lib/index';

export default class LoadSimulationModel extends React.Component {
	constructor () {
		super();
	}

	render () {
		return (
			<Modal
				style={{
					overlay: {
						backgroundColor: 'papayawhip'
					},
					content: {
						color: 'lightsteelblue'
					}
				}}
				isOpen={true}
				onRequestClose={this.props.clearActiveModal}
			>
				<h1>Load Simulation</h1>
				<h3>Styled Using Inline Styles</h3>
				<button onClick={this.props.clearActiveModal}>Close</button>
				<input />
				<input />
			</Modal>
		);
	}
}