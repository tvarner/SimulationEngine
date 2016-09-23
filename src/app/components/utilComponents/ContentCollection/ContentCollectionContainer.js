import { connect } from 'react-redux'
import {
	setView,
	setActiveModal,
	clearActiveModal
} from '../../pages/MainView/MainViewActions'
import ContentCollection from './ContentCollection'

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
		},
		openFullScreenContentModal: (content) => {
			dispatch(setActiveModal('FULL_SCREEN_CONTENT_MODAL', content));
		}
	}
}

const ContentCollectionContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ContentCollection)

export default ContentCollectionContainer