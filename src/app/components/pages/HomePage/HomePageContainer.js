import { connect } from 'react-redux'
import {
	setActiveModal,
	clearActiveModal,
	toggleSidebar,
	setView
} from '../MainView/MainViewActions'
import HomePage from './HomePage'

const mapStateToProps = (state) => { 
	return {
		//TODO
	}
}

/* UI Interactions */
// TODO: add remainder of 
const mapDispatchToProps = (dispatch) => {
	return {
		openHomePage: () => { 
			dispatch(setView("HOME_PAGE"))
		},

		openAboutPage: () => { 
			dispatch(setView("ABOUT_PAGE"))
		},

		openContactPage: () => { 
			dispatch(setView("CONTACT_PAGE"))
		},
		
		openContentPage: () => { 
			dispatch(setView("CONTENT_PAGE"))
		},

		openPhotographyPage: () => {
			dispatch(setView("PHOTOGRAPHY_PAGE"))
		},

		openFilmPage: () => { 
			dispatch(setView("FILM_PAGE"))
		},

		openFeaturePage: () => { 
			dispatch(setView("FEATURE_PAGE"))
		},

		openReelPage: () => { 
			dispatch(setView("REEL_PAGE"))
		}
	}
}

const HomePageContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(HomePage)

export default HomePageContainer