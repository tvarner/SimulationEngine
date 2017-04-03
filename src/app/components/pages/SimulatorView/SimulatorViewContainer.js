import { connect } from 'react-redux';
import {
	initializeSimulator,
	playSimulator,
	pauseSimulator,
	exitSimulator,
	pauseSimulation,
	destroySimulationGUI,
	initializeSimulationGUI
} from './SimulatorViewActions';
import SimulatorView from './SimulatorView';

const mapStateToProps = (state) => {
	return {
		simulationEngine: state.pages.simulatorView.simulationEngine
	};
};

/* UI Interactions */
const mapDispatchToProps = (dispatch) => {
	return {
		onPlaySimulator: (ev) => {
			if (ev !== undefined) { 
				ev.preventDefault();
			}
			dispatch(initializeSimulator());
			dispatch(playSimulator());
			dispatch(initializeSimulationGUI());
		},

		onNavigateFromSimulator: (ev) => { 
			if (ev !== undefined) { 
				ev.preventDefault();
			}
			dispatch(destroySimulationGUI());
			dispatch(pauseSimulation());
			dispatch(pauseSimulator());
		}
	};
};

const SimulatorViewContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SimulatorView);

export default SimulatorViewContainer;