export const toggleSidebar = (open) => { 
	return { 
		type: 'TOGGLE_SIDEBAR',
		open: open
	};
};

export const setView = (view, viewProps) => { 
	return { 
		type: 'SET_VIEW',
		view: view,
		viewProps: viewProps
	};
};

export const setActiveModal = (modal, modalProps) => { 
	return { 
		type: 'SET_ACTIVE_MODAL',
		modal: modal, 
		modalProps: modalProps
	};
};

export const clearActiveModal = () => { 
	return { 
		type: 'CLEAR_ACTIVE_MODAL'
	};
};

export const activateSpinner = () => { 
	return { 
		type: 'ACTIVATE_SPINNER'
	};
};

export const clearSpinner = () => { 
	return { 
		type: 'CLEAR_SPINNER'
	};
};