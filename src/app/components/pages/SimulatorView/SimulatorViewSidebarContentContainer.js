import { connect } from 'react-redux';
import {
	setActiveModal,
	toggleSidebar,
	setView
} from '../MainView/MainViewActions';
import {
	playSimulation,
	pauseSimulation,
	clearSimulation,
	destroySimulationGUI,
	setSimulationViewControls,
	initializeSimulator,
	playSimulator,
	initializeSimulationGUI
} from './SimulatorViewActions';
import SimulatorViewSidebarContent from './SimulatorViewSidebarContent';

const mapStateToProps = (state) => {
	return {
		simulator: state.pages.simulatorView.simulator
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onOpenLoadSimulationModal: (ev) => {
			if (ev !== undefined) { 
				ev.preventDefault();
			} 
			dispatch(pauseSimulation());
			dispatch(setActiveModal("LOAD_SIMULATION_MODAL"));
			dispatch(toggleSidebar(false));
		},

		onOpenSaveSimulationModal: (ev) => {
			if (ev !== undefined) { 
				ev.preventDefault();
			}
			dispatch(pauseSimulation());
			dispatch(setActiveModal("SAVE_SIMULATION_MODAL"));
			dispatch(toggleSidebar(false));
		},

		onOpenSimulatorDataView: (ev) => {
			if (ev !== undefined) { 
				ev.preventDefault();
			} 
			dispatch(pauseSimulation());
			dispatch(setView("SIMULATOR_DATA_VIEW"));
			dispatch(toggleSidebar(false));
		},

		onRunSimulation: (ev) => {
			if (ev !== undefined) { 
				ev.preventDefault();
			}

			dispatch(playSimulation());
			dispatch(toggleSidebar(false));
		},


		onStopSimulation: (ev) => {
			if (ev !== undefined) { 
				ev.preventDefault();
			} 
			dispatch(pauseSimulation());
			dispatch(toggleSidebar(false));
		}, 

		onClearSimulation: (ev) => {
			if (ev !== undefined) { 
				ev.preventDefault();
			}
			dispatch(pauseSimulation());
			dispatch(destroySimulationGUI());
			dispatch(clearSimulation(true));
			dispatch(toggleSidebar(false));

			dispatch(initializeSimulator());
			dispatch(playSimulator());
			dispatch(initializeSimulationGUI());
		},

		onNavigateFromSimulation: (ev) => {
			if (ev !== undefined) { 
				ev.preventDefault();
			}
			dispatch(pauseSimulation());
			dispatch(destroySimulationGUI());
			dispatch(toggleSidebar(false));
		},

		onSetSimulationViewControls: (ev) => {
			if (ev !== undefined) { 
				ev.preventDefault();
			} 
			dispatch(setSimulationViewControls());
		}
	};
};

const SimulatorViewSidebarContentContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SimulatorViewSidebarContent);

export default SimulatorViewSidebarContentContainer;