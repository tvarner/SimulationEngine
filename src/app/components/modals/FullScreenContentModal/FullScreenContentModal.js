import React from 'react';

import contentFileIndex from './../../../../content/_contentFileIndex';
import Modal from '../../utilComponents/react-modal/lib/index'

import './styles.css'

var FullScreenContentModal = React.createClass({
	getInitialState() {
		return { 
			infoIsOpen: false
		}
	},

	handleInfoToggle() {
		let infoIsOpen = !this.state.infoIsOpen
		this.setState({
			infoIsOpen: infoIsOpen
		})
	},

	componentDidMount() {
		// window.addEventListener('mousedown', this.pageClick, false);
	},

	getAuthors(authors) { 
		return authors.map(function(author) { 
			return (
				<span>{author}<span>{" "}</span></span>
			)
		})
	},

	getDescription(description) { 
		return (
			<span className={'full-screen-content-image-info-description'}>{description}</span>
		)
	},

	getDate(date) { 
		return (
			<span>{date}</span>
		)
	},

	getContentInfo() { 
		if (this.state.infoIsOpen) {
			return (
				<div className={'full-screen-content-image-info'} onClick={this.handleInfoToggle}>
					<div>
						<div style={{ margin: '1vh', fontSize: '3vh' }}>{this.props.data.name}</div>
						<div style={{ margin: '1vh' }}>By: {this.getAuthors(this.props.data.authors)}</div>
						<div style={{ margin: '1vh' }}>PUBLISHED: {this.getDate(this.props.data.dateCreated)}</div>
						<div style={{ margin: '1vh' }}>{this.getDescription(this.props.data.description)}</div>
					</div>
				</div>
			)
		}
	},

	getContent() {
		if (this.props.data.type === 'image') {
			const src = contentFileIndex[this.props.data.url]
			return (
				<div>
					<div className={'full-screen-content-image-info-container'}>
						<div className={'full-screen-content-image-info-toggle'} onClick={this.handleInfoToggle}>
							<div>INFO{' '}</div>
							{this.state.infoIsOpen ? 
								<div className={'full-screen-content-image-info-toggle-plus-minus'}>{" "}-</div> :
								<div className={'full-screen-content-image-info-toggle-plus-minus'}>{" "}+</div>
							}
						</div>
						{this.getContentInfo()}
					</div>
					<img className={'full-screen-content-image'} src={src} onClick={this.props.clearActiveModal} />
				</div>
			)
		} else if (this.props.data.type === 'video') {

		} else { 
			throw new Error('Invalid content type passed to FullScreenContentModal');
		}
	},

	render () {
		return (
			<Modal
				className={'full-screen-content-modal'}
				overlayClassName={'full-screen-content-modal-overlay'}
				isOpen={true}
				onRequestClose={this.props.clearActiveModal}
			>
				<div className={'full-screen-content-modal-content-container'}>
					{this.getContent()}
				</div>
			</Modal>
		);
	}
})

export default FullScreenContentModal;
