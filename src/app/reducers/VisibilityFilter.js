import { VISIBILITY_FILTERS, SET_VISIBILITY_FILTER } from '../appActionCreators';

export default function visibilityFilter(state = VISIBILITY_FILTERS.SHOW_ALL, action) {
	switch (action.type) {
	case SET_VISIBILITY_FILTER:
		return action.filter;
	default:
		return state;
	}
}