import React from 'react';

const styles = {
	root: {
		fontWeight: 300,
		height: '100%'
	},
	header: {
		overflow: 'hidden',
		backgroundColor: 'black',
		color: 'white',
		fontSize: '6vh',
		height: '10%',
		width: '100%',
		position: 'fixed',
		display: 'flex',
		alignItems: 'center',
		zIndex: 0
	},
};

const MaterialTitlePanel = (props) => {
	const rootStyle = props.style ? {...styles.root, ...props.style} : styles.root;

	return (
		<div className={'menu-root-container'} style={rootStyle}>
			<div style={styles.header}>{props.title}</div>
			{props.children}
		</div>
	);
};

MaterialTitlePanel.propTypes = {
	style: React.PropTypes.object,
	title: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.object,
	]),
	children: React.PropTypes.object,
};

export default MaterialTitlePanel;