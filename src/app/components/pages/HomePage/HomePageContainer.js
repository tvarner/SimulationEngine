import { connect } from 'react-redux';
import {
	setView
} from '../MainView/MainViewActions';
import HomePage from './HomePage';

const mapStateToProps = (state) => { 
	return state;
};

const mapDispatchToProps = (dispatch) => {
	return {
		openHomePage: () => { 
			dispatch(setView("HOME_PAGE"));
		},

		openAboutPage: () => { 
			dispatch(setView("ABOUT_PAGE"));
		},

		openContactPage: () => { 
			dispatch(setView("CONTACT_PAGE"));
		},
		
		openSimulatorView: () => { 
			dispatch(setView("SIMULATOR_VIEW"));
		}, 

		openSimulationView: () => { 
			dispatch(setView("SIMULATION_VIEW"));
		}
	};
};

const HomePageContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(HomePage);

export default HomePageContainer;