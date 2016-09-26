import { connect } from 'react-redux';
import {
	setView
} from '../MainView/MainViewActions';
import ContactPage from './ContactPage';

const mapStateToProps = (state) => { 
	return state;
};

const mapDispatchToProps = (dispatch) => {
	return {
		openReelPage: () => { 
			dispatch(setView("REEL_PAGE"));
		}
	};
};

const ContactPageContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ContactPage);

export default ContactPageContainer;