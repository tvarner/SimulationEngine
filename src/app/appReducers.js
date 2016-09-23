import { combineReducers } from 'redux'
import subredditReducers from './reducers/Subreddit'
import todos from './reducers/Todos'
import visibilityFilter from './reducers/VisibilityFilter'
import pages from './reducers/Pages'
import { routerReducer } from 'react-router-redux';


const rootReducer = combineReducers({
	pages,
	subreddit: subredditReducers,
	todos,
	visibilityFilter,
	routing: routerReducer
})

export default rootReducer;