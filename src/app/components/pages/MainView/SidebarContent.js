import React from 'react';

import MaterialTitlePanel from './MaterialTitlePanel';

import SimulatorViewSidebarContentContainer from '../SimulatorView/SimulatorViewSidebarContentContainer'

const styles = {
	sidebar: {
		height: '100%'
	},
	sidebarLink: {
		display: 'flex',
		padding: '3vh',
		color: '#757575',
		textDecoration: 'none',
		backgroundColor: 'white',
		alignItems: 'center',
		justifyContent: 'center'
	},

	divider: {
		margin: '8px 0',
		height: 1,
		backgroundColor: '#757575',
	},
	content: {
		paddingTop: '10vh',
		height: '100%',
		backgroundColor: 'white',
		fontSize: '2vw'
	},
};

/*
const customStyles = {
	content : {
		top                   : '50%',
		left                  : '50%',
		right                 : 'auto',
		bottom                : 'auto',
		marginRight           : '-50%',
		transform             : 'translate(-50%, -50%)'
	}
};
*/

const menuButtonHeaderStyles = { 
	width: '100%',
	height: '100%',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center'
};

const getMenuButtonHeader = function() { 
	return (
		<div className={'menu-button-header'} style={menuButtonHeaderStyles}>Menu</div>
	);
};


const SidebarContent = React.createClass({
	renderPageSidebarContent() {
		if (this.props.view === "SIMULATOR_VIEW") {
			return (
				<SimulatorViewSidebarContentContainer styles={styles} />
			)
		}
	},

	render() {
		const style = this.props.style ? {...styles.sidebar, ...this.props.style} : styles.sidebar;

		return (
			<div>
				<MaterialTitlePanel title={getMenuButtonHeader()} style={style}>
					<div className={'menu-content-container'} style={styles.content}>
						<div key={1} className={'menu-button-link grow'} onClick={this.props.openHomePage} style={styles.sidebarLink}>Home</div>
						<div key={2} className={'menu-button-link grow'} onClick={this.props.openAboutPage} style={styles.sidebarLink}>Theory</div>
						<div key={3} className={'menu-button-link grow'} onClick={this.props.openContactPage} style={styles.sidebarLink}>Connect</div>
						{this.renderPageSidebarContent()}
					</div>
				</MaterialTitlePanel>
			</div>
		);
	}
});

SidebarContent.propTypes = {
	style: React.PropTypes.object,
};

export default SidebarContent;