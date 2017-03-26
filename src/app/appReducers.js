import { combineReducers } from 'redux';
import pages from './reducers/Pages';
import exampleSimulation from './../SimulationEngine2/Simulations/ExampleSimulation/ExampleSimulationReducer';
import { routerReducer } from 'react-router-redux';


const rootReducer = combineReducers({
	pages,
	exampleSimulation,
	routing: routerReducer
});

export default rootReducer;