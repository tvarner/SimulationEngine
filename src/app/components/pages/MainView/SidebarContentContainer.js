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
		
		openContentPage: function() { 
			dispatch(setView("CONTENT_PAGE"));
			dispatch(toggleSidebar(false));
		},

		openPhotographyPage: function() { 
			dispatch(setView("PHOTOGRAPHY_PAGE"));
			dispatch(toggleSidebar(false));
		},

		openFilmPage: function() { 
			dispatch(setView("FILM_PAGE"));
			dispatch(toggleSidebar(false));
		},

		openFeaturePage: function() { 
			dispatch(setView("FEATURE_PAGE"));
			dispatch(toggleSidebar(false));
		},

		openReelPage: function() { 
			dispatch(setView("REEL_PAGE"));
			dispatch(toggleSidebar(false));
		}
	};
};

const SidebarContentContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SidebarContent);

export default SidebarContentContainer;