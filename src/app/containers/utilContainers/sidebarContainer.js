import { connect } from 'react-redux'
import { setVisibilityFilter } from '../appActionCreators'
import Link from '../components/Link'

import SideMenu from '../../components/utilComponents/SideMenu';





// TODO





const mapStateToProps = (state, ownProps) => {
    return {
        active: ownProps.filter === state.visibilityFilter
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onClick: () => {
            dispatch(setVisibilityFilter(ownProps.filter))
        }
    }
}

const FilterLink = connect(
    mapStateToProps,
    mapDispatchToProps
)(Link)

export default FilterLink