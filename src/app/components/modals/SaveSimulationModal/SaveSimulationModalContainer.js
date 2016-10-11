import { connect } from 'react-redux';
import {
	setView,
	setActiveModal,
	clearActiveModal
} from './../../pages/MainView/MainViewActions';
import SaveSimulationModal from './SaveSimulationModal';

const mapStateToProps = (state) => {
	return {
		activeModal: state.pages.mainView.modals.activeModal
	};
};

/* UI Interactions */
const mapDispatchToProps = (dispatch) => {
	return {
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

const SaveSimulationModalContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SaveSimulationModal);

export default SaveSimulationModalContainer;