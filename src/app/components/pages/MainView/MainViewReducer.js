import { combineReducers } from 'redux';

function sidebar(state = {
	docked: false,
	open: false,
	transitions: true,
	touch: true,
	shadow: true,
	pullRight: false,
	touchHandleWidth: 20,
	dragToggleDistance: 30,
	sidebarClassname: 'custom-sidebar-class'
}, action) {
	switch(action.type) { 
	case 'TOGGLE_SIDEBAR':
		return Object.assign({}, state, {
			open: !state.open
		});
	default:
		return state;
	}		
}

function view(state = "HOME_PAGE", action) { 
	switch (action.type) {
	case 'SET_VIEW':
		if (action.view === "HOME_PAGE") {
			return "HOME_PAGE";
		} else if (action.view === "ABOUT_PAGE") {
			return "ABOUT_PAGE";
		} else if (action.view === "CONTACT_PAGE") {
			return "CONTACT_PAGE";
		} else if (action.view === "CONTENT_PAGE") { 
			return "CONTENT_PAGE";
		} else if (action.view === "PHOTOGRAPHY_PAGE") { 
			return "PHOTOGRAPHY_PAGE";
		} else if (action.view === "FILM_PAGE") { 
			return "FILM_PAGE";
		} else if (action.view === "FEATURE_PAGE") { 
			return "FEATURE_PAGE";
		} else if (action.view === "REEL_PAGE") { 
			return "REEL_PAGE";
		} else {
			return state;
		}
	default:
		return state;
	}
}

function modals(state = {
	activeModal: null, 
	activeModalProps: null
}, action) {
	switch(action.type) { 
	case 'SET_ACTIVE_MODAL':
		if (action.modal === "SORT_COLLECTIONS_MODAL") { 
			return Object.assign({}, state, {
				activeModal: 'SORT_COLLECTIONS_MODAL',
				activeModalProps: action.modalProps
			});
		} else if (action.modal === "FULL_SCREEN_CONTENT_MODAL") { 
			return Object.assign({}, state, {
				activeModal: 'FULL_SCREEN_CONTENT_MODAL',
				activeModalProps: action.modalProps
			});
		} else { 
			return state;
		}
	case 'CLEAR_ACTIVE_MODAL': 
		return Object.assign({}, state, {
			activeModal: null,
			activeModalProps: null
		});
	default:
		return state;
	}
}

const mainView = combineReducers({
	sidebar, 
	view, 
	modals
});

export default mainView;