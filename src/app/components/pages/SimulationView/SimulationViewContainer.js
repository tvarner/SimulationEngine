import { connect } from 'react-redux';
import SimulationView from './SimulationView';

import Engine from './../../../../SimulationEngine2/SimulationEngine';

const mapStateToProps = (state) => {
	return {
		exampleSimulation: state.exampleSimulation
	};
};

/* UI Interactions YOO */
const mapDispatchToProps = function(/* dispatch */) {
	return {
		startSimulation: function() {
			Engine.runSimulation();
		}
	};
};

const SimulationViewContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SimulationView);

export default SimulationViewContainer;