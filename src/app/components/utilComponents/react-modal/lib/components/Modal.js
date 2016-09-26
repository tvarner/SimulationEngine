const React = require('react');
const ReactDOM = require('react-dom');
const ExecutionEnvironment = require('exenv');
const ModalPortal = React.createFactory(require('./ModalPortal'));
const ariaAppHider = require('../helpers/ariaAppHider');
const elementClass = require('element-class');
const renderSubtreeIntoContainer = require("react-dom").unstable_renderSubtreeIntoContainer;
const Assign = require('lodash.assign');

const SafeHTMLElement = ExecutionEnvironment.canUseDOM ? window.HTMLElement : {};

// let AppElement = ExecutionEnvironment.canUseDOM ? document.body : {appendChild: function() {}};

const Modal = React.createClass({

	displayName: 'Modal',

	propTypes: {
		isOpen: React.PropTypes.bool.isRequired,
		style: React.PropTypes.shape({
			content: React.PropTypes.object,
			overlay: React.PropTypes.object
		}),
		portalClassName: React.PropTypes.string,
		appElement: React.PropTypes.instanceOf(SafeHTMLElement),
		onAfterOpen: React.PropTypes.func,
		onRequestClose: React.PropTypes.func,
		closeTimeoutMS: React.PropTypes.number,
		ariaHideApp: React.PropTypes.bool,
		shouldCloseOnOverlayClick: React.PropTypes.bool
	},

	statics: {
		setAppElement: function(/* element */) {
			// weird hack
			// AppElement = this.appElement;
		},
		injectCSS: function() {
			return "production" !== process.env.NODE_ENV;
			// && console.warn('React-Modal: injectCSS has been deprecated ' + 'and no longer has any effect. It will be removed in a later version');
		}
	},

	getDefaultProps: function () {
		return {
			isOpen: false,
			portalClassName: 'ReactModalPortal',
			ariaHideApp: true,
			closeTimeoutMS: 0,
			shouldCloseOnOverlayClick: true
		};
	},

	componentDidMount: function() {
		this.node = document.createElement('div');
		this.node.className = this.props.portalClassName;
		document.body.appendChild(this.node);
		this.renderPortal(this.props);
	},

	componentWillReceiveProps: function(newProps) {
		this.renderPortal(newProps);
	},

	componentWillUnmount: function() {
		ReactDOM.unmountComponentAtNode(this.node);
		document.body.removeChild(this.node);
		elementClass(document.body).remove('ReactModal__Body--open');
	},

	appElement: ExecutionEnvironment.canUseDOM ? document.body : {appendChild: function() {}},

	renderPortal: function(props) {
		if (this.props.isOpen !== props.isOpen) {
			if (props.isOpen) {
				elementClass(document.body).add('ReactModal__Body--open');
			} else {
				elementClass(document.body).remove('ReactModal__Body--open');
			}

			if (props.ariaHideApp) {
				ariaAppHider.toggle(props.isOpen, props.appElement);
			}
		}

		this.portal = renderSubtreeIntoContainer(this, ModalPortal(Assign({}, props, {defaultStyles: Modal.defaultStyles})), this.node);
	},

	render: function () {
		return React.DOM.noscript();
	}
});

Modal.defaultStyles = {
	overlay: {
		position        : 'fixed',
		top             : 0,
		left            : 0,
		right           : 0,
		bottom          : 0,
		backgroundColor : 'rgba(255, 255, 255, 0.75)'
	},
	content: {
		position                : 'absolute',
		top                     : '40px',
		left                    : '40px',
		right                   : '40px',
		bottom                  : '40px',
		border                  : '1px solid #ccc',
		background              : '#fff',
		overflow                : 'auto',
		WebkitOverflowScrolling : 'touch',
		borderRadius            : '4px',
		outline                 : 'none',
		padding                 : '20px'
	}
};

module.exports = Modal;
