import { combineReducers } from 'redux'

import {
  MENU_TOGGLE
} from '../../actions/utilActions/SideMenuActions'

function menuDisplay(state = true, action) { 
	switch(action.type) { 
		case MENU_TOGGLE
			return !state
		default
			return state
	}
}

