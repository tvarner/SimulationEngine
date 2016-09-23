import { connect } from 'react-redux'
import {
	setActiveModal,
	clearActiveModal,
	toggleSidebar,
	setView
} from '../MainView/MainViewActions'
import ContactPage from './ContactPage'

const mapStateToProps = (state) => { 
	return {
		//TODO
	}
}

/* UI Interactions */
// TODO: add remainder of 
const mapDispatchToProps = (dispatch) => {
	return {
		openReelPage: () => { 
			dispatch(setView("REEL_PAGE"))
		}
	}
}

const ContactPageContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ContactPage)

export default ContactPageContainer