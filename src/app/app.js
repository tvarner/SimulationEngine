/*
	Application entry point
*/
import React, { Component, PropTypes } from 'react';

class Application extends Component {
	render() {
		if (!this.props.children) {
			return null;
		}
		return (
			<div className="page">
				{this.props.children}
			</div>
		);
	}
}

Application.displayName = 'Application';
Application.propTypes = {
	children: PropTypes.element
};

export default Application;