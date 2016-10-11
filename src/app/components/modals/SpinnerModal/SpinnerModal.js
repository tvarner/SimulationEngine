import React from 'react';
import Modal from './../../utilComponents/react-modal/lib/index';

import './styles.css';

export default class SpinnerModal extends React.Component {
	constructor () {
		super();
	}

	render () {
		return (
			<Modal
				className={'spinner'}
				overlayClassName={'spinner-overlay'}
				isOpen={true}
				onRequestClose={this.props.clearActiveModal}
			>
				Loading...
			</Modal>
		);
	}
}