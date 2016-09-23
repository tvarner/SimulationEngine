/*
	Application entry point
*/

import React, { Component, PropTypes } from 'react'

export default class Application extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="page">
				{this.props.children}
			</div>
		)
	}
}

Application.propTypes = {
	children: PropTypes.element
};