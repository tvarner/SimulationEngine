import { combineReducers } from 'redux';

function page(state = {
	time: parseInt(Math.random() * 10) + 1,
	accordion: false,
	activePanelKey: [null],
	text: 	'A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.',
	sortBy: 'title'
}, action) {
	switch(action.type) {
	case 'CHANGE_ACTIVE_PANEL':
		if (action.activePanelKey) { 
			return Object.assign({}, state, {
				activePanelKey: action.activePanelKey
			});
		} else { 
			return state;
		}
	case 'TOGGLE_ACCORDION':
		return Object.assign({}, state, {
			accordion: !state.accordion
		});
	case 'RE_RENDER':
		return Object.assign({}, state, {
			time: parseInt(Math.random() * 10) + 1
		});
	case 'SORT_BY':
		if (action.sortBy === 'title') { 
			return Object.assign({}, state, {
				sortBy: 'title'
			});
		} else if (action.sortBy === 'author') { 
			return Object.assign({}, state, {
				sortBy: 'author'
			});
		} else if (action.sortBy === 'date') { 
			return Object.assign({}, state, {
				sortBy: 'date'
			});
		} else { 
			return state;
		}
	default:
		return state;
	}
}

const contentPage = combineReducers({
	page
});

export default contentPage;