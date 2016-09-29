import { combineReducers } from 'redux';

// Import page reducers from ../components/pages/<Page>/ directories

import mainView from './../components/pages/MainView/MainViewReducer';
import simulatorView from './../components/pages/SimulatorView/SimulatorViewReducer';
// import contentPage from '../components/pages/ContentPage/ContentPageReducer';

const pages = combineReducers({
	mainView,
	simulatorView
});

export default pages;