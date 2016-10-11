import React from 'react';
import Modal from './../../utilComponents/react-modal/lib/index';

import './styles.css';

export default class SortCollectionsModal extends React.Component {
	constructor () {
		super();
	}

	render () {
		return (
			<Modal
				className={'sort-collections-modal'}
				overlayClassName={'sort-collections-modal-overlay'}
				isOpen={true}
				onRequestClose={this.props.clearActiveModal}
			>
				<div className={'sort-collections-modal-header'}>Sort collections by:</div>
				<div className={'sort-collections-modal-link'} onClick={this.props.sortCollectionsByAuthor}>Author</div>
				<div className={'sort-collections-modal-link'} onClick={this.props.sortCollectionsByTitle}>Title</div>
				<div className={'sort-collections-modal-link'} onClick={this.props.sortCollectionsByDate}>Most Recent</div>
			</Modal>
		);
	}
}