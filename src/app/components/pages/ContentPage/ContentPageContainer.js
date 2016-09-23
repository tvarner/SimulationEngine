import 'rc-collapse/assets/index.css';
import 'string.prototype.repeat';
import { connect } from 'react-redux'
import Collapse, { Panel } from 'rc-collapse';
import React from 'react';
import ContentPage from './ContentPage';

import {
	changeActivePanel,
	toggleAccordion,
	reRender
} from './ContentPageActions'

import { 
	setActiveModal
} from '../MainView/MainViewActions'

const mapStateToProps = (state) => {
	return {
		page: state.pages.contentPage.page
	}
}

/* UI Interactions */
const mapDispatchToProps = (dispatch) => {
	return {
		onChange: (activePanelKey) => {
			dispatch(changeActivePanel(activePanelKey));
		},

		setActivePanel: () => { 
			dispatch(changeActivePanel(['2']));
		},

		toggleAccordion: () => { 
			dispatch(toggleAccordion());
		},

		reRender: () => { 
			dispatch(reRender());
		},

		openSortCollectionsModal: () => { 
			dispatch(setActiveModal('SORT_COLLECTIONS_MODAL'));
		}
	}
}

const ContentPageContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ContentPage)

export default ContentPageContainer