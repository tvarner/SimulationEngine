import React, { connect } from 'react-redux';
import Application from './app';

const mapStateToProps = (state) => {
	return {
		state: state
	};
};

/* UI Interactions */
const mapDispatchToProps = () => {
	return {
		getChildren: () => {
			if (!this.props.children) {
				return <div />;
			}
			return this.props.children;
		}
	};
};

const ApplicationContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Application);

ApplicationContainer.displayName = 'ApplicationContainer';

export default ApplicationContainer;