import { connect } from 'react-redux';
import {
	setView,
	setActiveModal,
	clearActiveModal,
	activateSpinner,
	clearSpinner,
	toggleSidebar
} from './../../pages/MainView/MainViewActions';

import {
	initializeSimulationGUI,
	destroySimulationGUI,
	clearSimulation,
	setActiveSimulation,
	initializeSimulation,
	playSimulator,
	pauseSimulator,
	playSimulation
} from './../../pages/SimulatorView/SimulatorViewActions';

import LoadSimulationModal from './LoadSimulationModal';

const mapStateToProps = (state) => {
	return {
		activeModal: state.pages.mainView.modals.activeModal
	};
};

/* UI Interactions */
const mapDispatchToProps = function(dispatch) {
	return {
		startSimulation: function(simulationId) {
			// TODO: refactor this to a start simulation operation

			// set Active Simulation must be called before initialize Simulation
			// together these operations start a simulation

			// TODO: clear previous simulation if it exists
			
			const startSimulationFn = function() {
				dispatch(playSimulator());
				dispatch(setActiveSimulation(simulationId));
				dispatch(initializeSimulation());
				dispatch(initializeSimulationGUI());
				dispatch(clearActiveModal());
				dispatch(clearSpinner());

				dispatch(playSimulation());
			};

			const clearSimulationAndActivateSpinner = function() { 
				// clear previous simulation if it exists
				dispatch(destroySimulationGUI());
				dispatch(pauseSimulator());
				dispatch(clearSimulation());

				// unfortunate hack to avoid race condition
				setTimeout(this.forceUpdate.bind(this, startSimulationFn.bind(this)), 200);
			};

			dispatch(activateSpinner());
			this.forceUpdate(clearSimulationAndActivateSpinner.bind(this));
		},

		setView: function(view) { 
			dispatch(setView(view));
		}, 

		setActiveModal: function(modal) { 
			dispatch(setActiveModal(modal));
		},
		clearActiveModal: function() { 
			dispatch(clearActiveModal());
		}
	};
};

const LoadSimulationModalContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(LoadSimulationModal);

export default LoadSimulationModalContainer;