import { connect } from 'react-redux';
import {
	setActiveModal,
	toggleSidebar,
	setView
} from '../MainView/MainViewActions';
import {
	_initializeSimulation,
	_runSimulation,
	_stopSimulation,
	_clearSimulation,
	_initializeSimulationGUI,
	_destroySimulationGUI,
	_setSimulationViewControls,
	_setSceneElement
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
			dispatch(setActiveModal("LOAD_SIMULATION_MODAL"));
			dispatch(_stopSimulation());
			dispatch(toggleSidebar(false));
		},

		onOpenSaveSimulationModal: (ev) => {
			if (ev !== undefined) { 
				ev.preventDefault();
			}
			dispatch(setActiveModal("SAVE_SIMULATION_MODAL"));
			dispatch(_stopSimulation());
			dispatch(toggleSidebar(false));
		},

		onOpenSimulatorDataView: (ev) => {
			if (ev !== undefined) { 
				ev.preventDefault();
			} 
			dispatch(setView("SIMULATOR_DATA_VIEW"));
			dispatch(toggleSidebar(false));
		},

		onRunSimulation: (ev) => {
			if (ev !== undefined) { 
				ev.preventDefault();
			}

			dispatch(_initializeSimulation("TEMP_EXAMPLE"));
			dispatch(_runSimulation());
			
			// initialize Gui after starting simulation
			dispatch(_initializeSimulationGUI());
			dispatch(toggleSidebar(false));
		},


		onStopSimulation: (ev) => {
			if (ev !== undefined) { 
				ev.preventDefault();
			} 
			dispatch(_stopSimulation("TEMP_EXAMPLE"));
			dispatch(toggleSidebar(false));
		}, 

		onClearSimulation: (ev) => {
			if (ev !== undefined) { 
				ev.preventDefault();
			}
			dispatch(_destroySimulationGUI());
			dispatch(_clearSimulation());
			dispatch(toggleSidebar(false));
		},

		onNavigateFromSimulation: (ev) => {
			if (ev !== undefined) { 
				ev.preventDefault();
			}
			dispatch(_destroySimulationGUI());
			dispatch(_stopSimulation("TEMP_EXAMPLE"));
			dispatch(toggleSidebar(false));
		},

		onSetSimulationViewControls: (ev) => {
			if (ev !== undefined) { 
				ev.preventDefault();
			} 
			dispatch(_setSimulationViewControls());
		},

		onSetSceneElement: (ev) => {
			if (ev !== undefined) { 
				ev.preventDefault();
			} 
			dispatch(_setSceneElement());
		}
	};
};

const SimulatorViewSidebarContentContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SimulatorViewSidebarContent);

export default SimulatorViewSidebarContentContainer;