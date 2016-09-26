import { connect } from 'react-redux';
import {
	setView
} from '../MainView/MainViewActions';
import ContactPage from './ContactPage';

const mapDispatchToProps = (dispatch) => {
	return {
		openReelPage: () => { 
			dispatch(setView("REEL_PAGE"));
		}
	};
};

const ContactPageContainer = connect(
	mapDispatchToProps
)(ContactPage);

export default ContactPageContainer;