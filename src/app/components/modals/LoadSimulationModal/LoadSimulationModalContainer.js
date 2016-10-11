import { connect } from 'react-redux';
import {
	setView,
	setActiveModal,
	clearActiveModal,
	activateSpinner,
	clearSpinner
} from './../../pages/MainView/MainViewActions';

import {
	initializeSimulationGUI,
	destroySimulationGUI,
	clearSimulation,
	setActiveSimulation,
	initializeSimulation
} from './../../pages/SimulatorView/SimulatorViewActions';

import LoadSimulationModal from './LoadSimulationModal';

const mapStateToProps = (state) => {
	return {
		activeModal: state.pages.mainView.modals.activeModal
	};
};

/* UI Interactions */
const mapDispatchToProps = (dispatch) => {
	return {
		startSimulation: (simulationId) => {
			// TODO: refactor this to a start simulation operation

			// set Active Simulation must be called before initialize Simulation
			// together these operations start a simulation

			// TODO: clear previous simulation if it exists
			
			// clear previous simulation if it exists
			dispatch(destroySimulationGUI());
			dispatch(clearSimulation(true));

			// load new simulation
			dispatch(activateSpinner());

			// debugger;
			dispatch(setActiveSimulation(simulationId));
			dispatch(initializeSimulation());
			dispatch(clearSpinner());

			dispatch(initializeSimulationGUI());
			dispatch(clearActiveModal());
		},

		setView: (view) => { 
			dispatch(setView(view));
		}, 

		setActiveModal: (modal) => { 
			dispatch(setActiveModal(modal));
		},
		clearActiveModal: () => { 
			dispatch(clearActiveModal());
		}
	};
};

const LoadSimulationModalContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(LoadSimulationModal);

export default LoadSimulationModalContainer;