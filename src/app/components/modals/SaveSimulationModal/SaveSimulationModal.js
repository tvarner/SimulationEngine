import React from 'react'
import Modal from '../../utilComponents/react-modal/lib/index'

export default class LoadSimulationModel extends React.Component {
	constructor () {
		super();
	}

	render () {
		const _onRequestClose = this.props.clearActiveModal;

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
				onRequestClose={_onRequestClose}
			>
				<h1>Save Simulation Modal</h1>
				<h3>Styled Using Inline Styles</h3>
				<button onClick={this.props.clearActiveModal}>Close</button>
				<input />
				<input />
			</Modal>
		);
	}
}