import React from 'react';
import './styles.css';

const SimulatorViewSidebarContent = React.createClass({
	displayName: 'SimulatorViewSidebarContent',

	render: function() {
		return(
			<div style={this.props.styles.content}>
				<a key={4} onClick={this.props.onOpenLoadSimulationModal} style={this.props.styles.sidebarLink}>Load Simulation Model</a>
				<a key={5} onClick={this.props.onOpenSaveSimulationModal} style={this.props.styles.sidebarLink}>Save Simulation Model</a>
				<a key={6} onClick={this.props.onOpenSimulatorDataView} style={this.props.styles.sidebarLink}>Data View</a>
				<a key={7} onClick={this.props.onRunSimulation} style={this.props.styles.sidebarLink}>Run Simulation</a>
				<a key={8} onClick={this.props.onStopSimulation} style={this.props.styles.sidebarLink}>Stop Simulation</a>
				<a key={9} onClick={this.props.onClearSimulation} style={this.props.styles.sidebarLink}>Clear Simulation</a>
			</div>
		);
	}
});

export default SimulatorViewSidebarContent;