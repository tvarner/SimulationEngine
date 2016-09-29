import React from 'react';
import _ from 'lodash';

import Sidebar from './../../utilComponents/react-sidebar/src/index';
import MaterialTitlePanel from './MaterialTitlePanel';
import SidebarContentContainer from './SidebarContentContainer';

import HomePageContainer from '../HomePage/HomePageContainer';
import AboutPage from '../AboutPage/AboutPage';
import ContactPageContainer from '../ContactPage/ContactPageContainer';

// simulator components
import SimulatorViewContainer from '../SimulatorView/SimulatorViewContainer'
import SimulatorDataView from '../SimulatorDataView/SimulatorDataView'
import LoadSimulationModalContainer from '../../modals/LoadSimulationModal/LoadSimulationModalContainer'
import SaveSimulationModalContainer from '../../modals/SaveSimulationModal/SaveSimulationModalContainer'

import SortCollectionsModalContainer from '../../modals/SortCollectionsModal/SortCollectionsModalContainer';
import FullScreenContentModalContainer from '../../modals/FullScreenContentModal/FullScreenContentModalContainer';

import './styles.css';

const styles = {
	contentHeaderMenuLink: {
		textDecoration: 'none',
		color: 'white',
		padding: '8px',
		backgroundGolor: '#00FF00',
		margin: '2vh'
	},
	content: {}
};

const Application = React.createClass({

	_renderActiveModal() {
		// Modals: 

		// ADD ACTIVE MODAL LOGIC (one MODAL at a time)
		if (this.props.modals.activeModal !== null) {
			if (this.props.modals.activeModal === 'SORT_COLLECTIONS_MODAL') {
				return (
					<SortCollectionsModalContainer data={this.props.modals.activeModalProps} />
				);
			}
			if (this.props.modals.activeModal === 'FULL_SCREEN_CONTENT_MODAL') {
				return (
					<FullScreenContentModalContainer data={this.props.modals.activeModalProps} />
				);
			}
			if (this.props.modals.activeModal === 'LOAD_SIMULATION_MODAL') {
				return (
					<LoadSimulationModalContainer />
				)
			} else if (this.props.modals.activeModal === 'SAVE_SIMULATION_MODAL') { 
				return (
					<SaveSimulationModalContainer />
				)
			}
		}
	},

	_renderPage(page) {
		return (
			<div style={{ height: '90vh', width: '100vw'}}>
				{page}
				{this._renderActiveModal()}
			</div>
		);
	},

	renderView() {
		// Views
		if (this.props.view === "HOME_PAGE") { 
			return (
				this._renderPage(<HomePageContainer />)
			);
		} else if (this.props.view === "ABOUT_PAGE") { 
			return (
				this._renderPage(<AboutPage />)
			);
		} else if (this.props.view === "CONTACT_PAGE") { 
			return (
				this._renderPage(<ContactPageContainer />)
			);  
		} else if (this.props.view === "SIMULATOR_VIEW") { 
			return (
				this._renderPage(<SimulatorViewContainer />)
			)	
		} else if (this.props.view === "SIMULATOR_DATA_VIEW") { 
			return (
				this._renderPage(<SimulatorDataView />)
			)	
		}
	},

	render() {
		const sidebarProps = this.props.sidebar;
		_.extend(sidebarProps, {
			onSetOpen: this.props.setSidebarOpen,
			sidebar: <SidebarContentContainer view={this.props.view}/>
		});

		// TODO: rename contentHeader to toolbar 
		const contentHeader = (
			<div style={{height: '100%', display: 'flex', alignItems: 'center'}}>
				<div className={'main-view-logo'} onClick={this.props.logoButtonClick}>
					<img role={"presentation"} className={'logo-image'} src={require('./../../../styles/assets/OfficialLogo.jpg')} />
				</div>
				{!this.props.sidebar.docked &&
				<div className="main-menu-icon" onClick={this.props.menuButtonClick}>
					<div className="main-menu-icon-one" />
					<div className="main-menu-icon-two" />
				</div>}
			</div>
		);

		return (
			<Sidebar {...sidebarProps}>
				<MaterialTitlePanel title={contentHeader}>
					<div className="view" style={styles.content}>
						{this.renderView()}
					</div>
				</MaterialTitlePanel>
			</Sidebar>
		);
	}
});

export default Application;