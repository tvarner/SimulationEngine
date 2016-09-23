import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'

import Sidebar from 'react-sidebar'
import MaterialTitlePanel from './MaterialTitlePanel'
import SidebarContentContainer from './SidebarContentContainer'

import HomePageContainer from '../HomePage/HomePageContainer'
import AboutPage from '../AboutPage/AboutPage'
import ContactPageContainer from '../ContactPage/ContactPageContainer'
import ContentPageContainer from '../ContentPage/ContentPageContainer'

import SortCollectionsModalContainer from '../../modals/SortCollectionsModal/SortCollectionsModalContainer'
import FullScreenContentModalContainer from '../../modals/FullScreenContentModal/FullScreenContentModalContainer'

import './styles.css'
import logo from './../../../styles/assets/OfficialLogo.jpg'

const styles = {
	contentHeaderMenuLink: {
		textDecoration: 'none',
	    color: 'white',
	    padding: '8px',
	    backgroundGolor: '#00FF00',
	    margin: '2vh'
	},
	content: {

	}
}

const Application = React.createClass({

	_renderActiveModal() {
		// Modals: 

		// ADD ACTIVE MODAL LOGIC (one MODAL at a time)
		if (this.props.modals.activeModal !== null) {

			if (this.props.modals.activeModal === 'SORT_COLLECTIONS_MODAL') {
				return (
					<SortCollectionsModalContainer data={this.props.modals.activeModalProps} />
				)
			}

			if (this.props.modals.activeModal === 'FULL_SCREEN_CONTENT_MODAL') {
				return (
					<FullScreenContentModalContainer data={this.props.modals.activeModalProps} />
				)
			}

			/*
			if (this.props.modals.activeModal === 'LOAD_SIMULATION_MODAL') {
				return (
					<LoadSimulationModalContainer />
				)
			} else if (this.props.modals.activeModal === 'SAVE_SIMULATION_MODAL') { 
				return (
					<SaveSimulationModalContainer />
				)
			}
			*/
		}
	},

	_renderPage(page) {
			return (
				<div style={{ height: '100%', width: '100%'}}>
					{page}
					{this._renderActiveModal()}
				</div>
			)	
	},

	renderView() {
		
		// Views
		if (this.props.view === "HOME_PAGE") { 
			return (
				this._renderPage(<HomePageContainer />)
			)
		} else if (this.props.view === "ABOUT_PAGE") { 
			return (
				this._renderPage(<AboutPage />)
			)
		} else if (this.props.view === "CONTACT_PAGE") { 
			return (
				this._renderPage(<ContactPageContainer />)
			)	
		} else if (this.props.view === "PHOTOGRAPHY_PAGE") { 
			return (
				this._renderPage(<ContentPageContainer category={'photography'} header={'PHOTOGRAPHY'} />)
			)	
		} else if (this.props.view === "FILM_PAGE") { 
			return (
				this._renderPage(<ContentPageContainer category={'film'} header={'FILM'}/>)
			)	
		} else if (this.props.view === "FEATURE_PAGE") { 
			return (
				this._renderPage(<ContentPageContainer category={'feature'} header={'FEATURE'}/>)
			)	
		} else if (this.props.view === "REEL_PAGE") { 
			return (
				this._renderPage(<ContentPageContainer category={'reel'} header={'REEL'} />)
			)	
		}
	},

	render() {
		const sidebarProps = this.props.sidebar
		_.extend(sidebarProps, {
			onSetOpen: this.props.setSidebarOpen,
			sidebar: <SidebarContentContainer view={this.props.view}/>
		})

		// TODO: rename contentHeader to toolbar 
		const contentHeader = (
			<div style={{height: '100%', display: 'flex', alignItems: 'center'}}>
				<div className={'main-view-logo'} onClick={this.props.logoButtonClick}>
					<img className={'logo-image'} src={logo} />
				</div>
				{!this.props.sidebar.docked &&
				<div className="main-menu-icon" onClick={this.props.menuButtonClick}>
					<div className="main-menu-icon-one"></div>
					<div className="main-menu-icon-two"></div>
				</div>}
			</div>
		)

		return (
			<Sidebar {...sidebarProps}>
				<MaterialTitlePanel title={contentHeader}>
					<div className="view" style={styles.content}>
						{this.renderView()}
					</div>
				</MaterialTitlePanel>
			</Sidebar>
		)
	}
})

export default Application