import { createStore, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from '../appReducers';

export default function configureStore(initialState) {
	const loggerMiddleware = createLogger();

	const middewares = [
		// Add other middleware on this line...

		// thunk middleware can also accept an extra argument to be passed to each thunk action
		// https://github.com/gaearon/redux-thunk#injecting-a-custom-argument
		thunkMiddleware,
		loggerMiddleware
	];

	return createStore(
		rootReducer, 
		initialState, 
		compose(
			applyMiddleware(...middewares)
		)
	);
}