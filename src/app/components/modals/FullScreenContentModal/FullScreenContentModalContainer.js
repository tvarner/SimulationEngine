import { connect } from 'react-redux'
import {
	setView,
	setActiveModal,
	clearActiveModal
} from '../../pages/MainView/MainViewActions'
import FullScreenContentModal from './FullScreenContentModal'

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

const FullScreenContentModalContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(FullScreenContentModal)

export default FullScreenContentModalContainer