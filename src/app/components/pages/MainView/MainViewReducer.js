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
		} else if (action.view === "SIMULATOR_VIEW") { 
			return "SIMULATOR_VIEW";
		} else {
			return state;
		}
	default:
		return state;
	}
}

function modals(state = {
	activeModal: null, 
	activeModalProps: null,
	spinnerActive: false
}, action) {
	switch(action.type) { 
	case 'SET_ACTIVE_MODAL':
		if (action.modal === "LOAD_SIMULATION_MODAL") { 
			return Object.assign({}, state, {
				activeModal: 'LOAD_SIMULATION_MODAL',
				activeModalProps: action.modalProps
			});
		} else if (action.modal === "SAVE_SIMULATION_MODAL") { 
			return Object.assign({}, state, {
				activeModal: 'SAVE_SIMULATION_MODAL',
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
	case 'ACTIVATE_SPINNER':
		return Object.assign({}, state, {
			spinnerActive: true
		});
	case 'CLEAR_SPINNER':
		return Object.assign({}, state, {
			spinnerActive: false
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