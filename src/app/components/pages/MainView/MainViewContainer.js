import { connect } from 'react-redux'
import {
	toggleSidebar,
	setView
} from './MainViewActions'
import MainView from './MainView'

const mapStateToProps = (state) => {
	return {
		modals: state.pages.mainView.modals,
		sidebar: state.pages.mainView.sidebar,
		view: state.pages.mainView.view
	}
}

/* UI Interactions */
const mapDispatchToProps = (dispatch) => {
	return {
		menuButtonClick: (ev) => { 
			ev.preventDefault();
			dispatch(toggleSidebar(true));
		},

		logoButtonClick: (ev) => { 
			ev.preventDefault();
			dispatch(setView("HOME_PAGE"));
		},
		
		setSidebarOpen: () => {
			dispatch(toggleSidebar(false));
		}
	}
}

const MainViewContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(MainView)

export default MainViewContainer