import { connect } from 'react-redux'
import {
	setView,
	setActiveModal,
	clearActiveModal
} from '../../pages/MainView/MainViewActions'
import LoadSimulationModal from './LoadSimulationModal'

const mapStateToProps = (state) => {
	return {
		activeModal: state.pages.mainView.modals.activeModal
	}
}

/* UI Interactions */
const mapDispatchToProps = (dispatch) => {
	return {
		setView: (view) => { 
			dispatch(setView(view))
		}, 

		setActiveModal: (modal) => { 
			dispatch(setActiveModal(modal))
		},
		clearActiveModal: () => { 
			dispatch(clearActiveModal())
		}
	}
}

const LoadSimulationModalContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(LoadSimulationModal)

export default LoadSimulationModalContainer