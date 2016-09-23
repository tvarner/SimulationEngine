import { connect } from 'react-redux'
import {
	_runSimulator,
	_stopSimulator,
	_exitSimulator,
	_stopSimulation,
	_destroySimulationGUI
} from './SimulatorViewActions'
import SimulatorView from './SimulatorView'

const mapStateToProps = (state) => {
	return {
		simulator: state.pages.simulatorView.simulator
	}
}

/* UI Interactions */
const mapDispatchToProps = (dispatch) => {
	return {
		onRunSimulator: (ev) => {
			if (ev !== undefined) { 
				ev.preventDefault();
			}
			dispatch(_runSimulator());
		},

		onNavigateFromSimulator: (ev) => { 
			if (ev !== undefined) { 
				ev.preventDefault()
			}
			dispatch(_stopSimulation());
			dispatch(_stopSimulator());
			dispatch(_destroySimulationGUI());
		},

		onStopSimulator: (ev) => {
			if (ev !== undefined) { 
				ev.preventDefault()
			} 
			dispatch(_stopSimulator());
		},

		onExitSimulator: (ev) => { 
			if (ev !== undefined) { 
				ev.preventDefault()
			}
			dispatch(_exitSimulator());		
		}
	}
}

const SimulatorViewContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SimulatorView)

export default SimulatorViewContainer