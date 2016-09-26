import React from 'react';

const HoverButton = React.createClass({
	getInitialState: function () {
		return {hover: false};
	},
	
	mouseOver: function () {
		this.setState({hover: true});
	},
	
	mouseOut: function () {
		this.setState({hover: false});
	},
	
	render: function() {
		let label = this.props.defaultContent;
		if (this.state.hover) {
			label = this.props.hoverContent;
		}
		return React.createElement(
			"div",
			{
				className: "hover-button", 
				onMouseOver: this.mouseOver, 
				onMouseOut: this.mouseOut,
				onClick: this.props.onClick
			},
			label
		);
	}
});

export default HoverButton;