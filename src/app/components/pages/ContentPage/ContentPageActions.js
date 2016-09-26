export const changeActivePanel = (activePanelKey) => { 
	return { 
		type: 'CHANGE_ACTIVE_PANEL',
		activePanelKey: activePanelKey
	};
};

export const toggleAccordion = () => { 
	return {
		type: 'TOGGLE_ACCORDION'
	};
};

export const reRender = () => { 
	return { 
		type: 'RE_RENDER'
	};
};

export const sortBy = (sortBy) => { 
	return { 
		type: 'SORT_BY',
		sortBy: sortBy
	};
};