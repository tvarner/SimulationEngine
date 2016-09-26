import React from 'react';

import './styles.css';

const VideoContentInfo = React.createClass({

	getInitialState: function() { 
		return { 
			visible: false
		};
	},

	getAuthors(authors) { 
		return authors.map(function(author, i) { 
			return (
				<span key={i}>{author}<span>{" "}</span></span>
			);
		});
	},

	getDescription(description) { 
		return (
			<span className={'full-screen-content-image-info-description'}>{description}</span>
		);
	},

	getDate(date) { 
		return (
			<span>{date}</span>
		);
	},

	toggleVisibility() {
		const visibility = !this.state.visible;
		this.setState({
			visible: visibility
		});
	},

	getVisibility() { 
		if (!this.state.visible) { 
			return {
				display: 'none'
			};
		}
	},

	render: function() {
		return(
			<div>
				<div 
					className={'content-info-icon'}
					onClick={this.toggleVisibility}>
					INFO
				</div>
				<div style={this.getVisibility()} className={'video-content-info'} onClick={this.toggleVisibility}>
					<div>
						<div style={{ margin: '1vh', fontSize: '3vh' }}>{this.props.content.name}</div>
						<div style={{ margin: '1vh', fontSize: '2vh' }}>By: {this.getAuthors(this.props.content.authors)}</div>
						<div style={{ margin: '1vh', fontSize: '2vh' }}>PUBLISHED: {this.getDate(this.props.content.dateCreated)}</div>
						<div style={{ margin: '1vh', fontSize: '2vh' }}>{this.getDescription(this.props.content.description)}</div>
					</div>
				</div>
			</div>
		);
	}
});

export default VideoContentInfo;