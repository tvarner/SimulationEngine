import { combineReducers } from 'redux';

function infoContainer(state = {
	visible: false
}, action) {
	switch(action.type) { 
	case 'TOGGLE_VISIBILITY':
		return Object.assign({}, state, {
			visible: !state.visible
		});
	default: 
		return state;
	}		
}

const VideoContentInfoReducer = combineReducers({
	infoContainer
});

export default VideoContentInfoReducer;