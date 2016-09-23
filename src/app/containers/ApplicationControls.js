import React, { Component, PropTypes } from 'react'
import Sidebar from '../components/utilComponents/Sidebar'

/*
	Components
*/
import SideMenuContainer from './utilContainers/SideMenuContainer';

export default class ApplicationControls extends Component { 
	render() { 
		return(
			<div>
				<SideMenuContainer />
			</div>
		)
	}
}