import { connect } from 'react-redux';
import {
	toggleSidebar,
	setView
} from './MainViewActions';

import SidebarContent from './SidebarContent';

const mapStateToProps = function(state) { 
	return state;
};

const mapDispatchToProps = function(dispatch) {
	return {
		openHomePage: function() { 
			dispatch(setView("HOME_PAGE"));
			dispatch(toggleSidebar(false));
		},

		openAboutPage: function() { 
			dispatch(setView("ABOUT_PAGE"));
			dispatch(toggleSidebar(false));
		},

		openContactPage: function() { 
			dispatch(setView("CONTACT_PAGE"));
			dispatch(toggleSidebar(false));
		},
		
		openSimulatorView: function() { 
			dispatch(setView("SIMULATOR_VIEW"));
			dispatch(toggleSidebar(false));
		}
	};
};

const SidebarContentContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SidebarContent);

export default SidebarContentContainer;