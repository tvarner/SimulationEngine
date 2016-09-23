import { combineReducers } from 'redux'

// import page reducers from pages/<Page>/ directories

import mainView from '../components/pages/MainView/MainViewReducer'
import contentPage from '../components/pages/ContentPage/ContentPageReducer'
// import simulatorView from '../components/pages/SimulatorView/SimulatorViewReducer'

const pages = combineReducers({
	mainView,
	contentPage
})

export default pages;