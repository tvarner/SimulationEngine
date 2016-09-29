import React from 'react';
import './styles.css';

const SimulatorViewSidebarContent = React.createClass({
	displayName: 'SimulatorViewSidebarContent',

	render: function() {
		return(
			<div style={this.props.styles.content}>
				<a key={4} className={'menu-button-link grow'} onClick={this.props.onOpenLoadSimulationModal} style={this.props.styles.sidebarLink}>Load Simulation Model</a>
				<a key={5} className={'menu-button-link grow'} className={'menu-button-link grow'} onClick={this.props.onOpenSaveSimulationModal} style={this.props.styles.sidebarLink}>Save Simulation Model</a>
				<a key={6} className={'menu-button-link grow'} onClick={this.props.onOpenSimulatorDataView} style={this.props.styles.sidebarLink}>Data View</a>
				<a key={7} className={'menu-button-link grow'} onClick={this.props.onRunSimulation} style={this.props.styles.sidebarLink}>Run Simulation</a>
				<a key={8} className={'menu-button-link grow'} onClick={this.props.onStopSimulation} style={this.props.styles.sidebarLink}>Stop Simulation</a>
				<a key={9} className={'menu-button-link grow'} onClick={this.props.onClearSimulation} style={this.props.styles.sidebarLink}>Clear Simulation</a>
			</div>
		);
	}
});

export default SimulatorViewSidebarContent;