import { connect } from 'react-redux'
import {
	setView,
	setActiveModal,
	clearActiveModal
} from '../../pages/MainView/MainViewActions'
import { 
	sortBy
} from '../../pages/ContentPage/ContentPageActions'
import SortCollectionsModal from './SortCollectionsModal'

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

		sortCollectionsByTitle: () => { 
			dispatch(sortBy('title'))
		},

		sortCollectionsByAuthor: () => { 
			dispatch(sortBy('author'))
		},

		sortCollectionsByDate: () => { 
			dispatch(sortBy('date'))
		}
	}
}

const SortCollectionsModalContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SortCollectionsModal)

export default SortCollectionsModalContainer