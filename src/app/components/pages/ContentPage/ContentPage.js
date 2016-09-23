import React from 'react';
import {Link} from 'react-router';
import _ from 'lodash';

import Collapse from '../../utilComponents/collapse/src/Collapse';
import Panel from '../../utilComponents/collapse/src/Panel';
import './styles.css';

import ContentCollectionContainer from '../../utilComponents/ContentCollection/ContentCollectionContainer'
import ContentCollectionHeader from '../../utilComponents/ContentCollectionHeader/ContentCollectionHeader'

import Carousel from 'nuka-carousel'

// Since this component is simple and static, there's no parent container for it.

const ContentPage = React.createClass({

	getInitialState() { 
		return {}
	},

	_checkIfContentCollectionActive(key) {
		for (var i = 0; i <= this.props.page.activePanelKey.length; i++) { 
			if (this.props.page.activePanelKey[i] === key.toString()) { 
				return true;
			}
		}
		return false;
	},

	getCollections(contentMonolith) {
		this.state.category = this.props.category;

		var _contentMonolithQueryFn = function(collection) { 
			 var _collectionQueryFn = function(collection) {
			 	var _categoryQueryFn = function(category) {
			 		return this.state.category == category;
				}
				return _.find(collection.category, _categoryQueryFn.bind(this))
			}
			return _collectionQueryFn.call(this, collection);
		}

		this.state.collections = _.filter(contentMonolith.collections, _contentMonolithQueryFn.bind(this));
	},

	componentWillMount() {
		this.state.contentMonolith = require('./../../../../content/_content.json');
		this.getCollections(this.state.contentMonolith); 
	},

	sortCollectionsByTitle() {
		this.state.collections.sort(function(a, b) {
			var titleA = a.name.toUpperCase(); // ignore upper and lowercase
			var titleB = b.name.toUpperCase(); // ignore upper and lowercase
			if (titleA < titleB) {
				return -1;
			}
			if (titleA > titleB) {
				return 1;
			}

			// names must be equal
			return 0;
		});
	},

	sortCollectionsByAuthor() {
		this.state.collections.sort(function(a, b) {
			var authorA = a.authors[0].toUpperCase(); // ignore upper and lowercase
			var authorB = b.authors[0].toUpperCase(); // ignore upper and lowercase
			if (authorA < authorB) {
				return -1;
			}
			if (authorA > authorB) {
				return 1;
			}

			// names must be equal
			return 0;
		});
	},

	sortCollectionsByDate() { 
		this.state.collections.sort(function(a, b) { 
			return new Date(a.dateCreated) - new Date(b.dateCreated); 
		})
	},

	addAlphabeticalJumpLinks() { 

	},

	getHeader(carouselRef, content) {
		return (
			<div>
				<ContentCollectionHeader carouselRef={carouselRef} content={content} />
			</div>
		)
	},

	getContentCollection(content, key) {
		let headerCarouselRef = 'headerCarousel' + key.toString();
		let mainCarouselRef = 'mainCarousel' + key.toString();

// add alpha jump ids here: 
		var alphaJumpElementId = 'alpha-jump-no-jump';
		if (this.props.page.sortBy === 'title') {
			// get first character
			var _alphaJumpFirstChar = content.name.charAt(0);
			// check if first character is in provided alphabet array. remove if present. update alphaJumpElementId
			if (_.find(this._alphabet, function(letter) { return letter === _alphaJumpFirstChar})) { 
				_.remove(this._alphabet, function(letter) { return letter === _alphaJumpFirstChar});
				alphaJumpElementId = 'alpha-jump-' + _alphaJumpFirstChar.toUpperCase();
			}
		} else if (this.props.page.sortBy === 'author') { 
			// get first character
			var _alphaJumpFirstChar = content.authors[0].charAt(0);
			// check if first character is in provided alphabet array. remove if present. update alphaJumpElementId
			if (_.find(this._alphabet, function(letter) { return letter === _alphaJumpFirstChar})) { 
				_.remove(this._alphabet, function(letter) { return letter === _alphaJumpFirstChar});
				alphaJumpElementId = 'alpha-jump-' + _alphaJumpFirstChar.toUpperCase();
			}
		}

		if (this._checkIfContentCollectionActive(key)) {
			return (
				<Panel header={this.getHeader(headerCarouselRef, content)} key={key} externalId={alphaJumpElementId}>
					<ContentCollectionContainer carouselRef={mainCarouselRef} content={content} />
				</Panel>
			)
		} else {
			return (
				<Panel header={this.getHeader(headerCarouselRef, content)} key={key} externalId={alphaJumpElementId}></Panel>
			)
		}
	},

	getContentCollections() {
		this.getCollections(this.state.contentMonolith);

		if (this.props.page.sortBy === 'title') { 
			// sort collections by title
			this.sortCollectionsByTitle();
		} else if (this.props.page.sortBy === 'date') { 
			// sort collections by date
			this.sortCollectionsByDate();
		} else if (this.props.page.sortBy === 'author') { 
			// sort collecitons by author
			this.sortCollectionsByAuthor();
		}
		this._alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
		var collections = this.state.collections.map(this.getContentCollection.bind(this));
		
		if (collections.length === 0) { 
			return (
				<div>
					Coming soon. ;)
				</div>
			)
		}

		return collections;
	},

	render() {
		const accordion = this.props.page.accordion;
		const btn = accordion ? 'accordion' : 'collapse';
		const activePanelKey = this.props.page.activePanelKey;

		const _alphaJumpIcons = ["%", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
		const _alphabeticalJumpIconHeight = 100 / (_alphaJumpIcons.length + 5);
		const alphabeticalJumpIconHeight = _alphabeticalJumpIconHeight.toString() + "vh";
		
		const _getIconFn = function(icon, i) {
			if (icon === "%") {
				return (
					<div key={i} onClick={this.props.openSortCollectionsModal} className={"alphabetical-jump-icon"}>{icon}</div> 
				) 
			}
			
			if (this.props.page.sortBy === 'title' || this.props.page.sortBy === 'author') { 
				var alphaJumpId = 'alpha-jump-' + icon;
				var alphaJumpHandler = function() { 
					if (document.getElementById(alphaJumpId)) { 
						document.getElementById(alphaJumpId).scrollIntoView();
					}
					console.log(alphaJumpId);
				}

				return (
					<div 
						key={i} 
						className={"alphabetical-jump-icon"}
						onClick={alphaJumpHandler}>
						{icon}
					</div> 
				)
			}
		}

		const getAlphaJumpIcons = _alphaJumpIcons.map(_getIconFn.bind(this))

		return (
			<div style={{ width: '100%' }}>
				<div className={"content-page"}>
					<div className={"alphabetical-jump"}>
						{getAlphaJumpIcons}
					</div>
					<div className={"content-container"}>
						<div className={'header-container'}>{this.props.header}</div>
						<Collapse
							accordion={accordion}
							onChange={this.props.onChange}
							activeKey={this.props.page.activePanelKey}
						>
							{this.getContentCollections()}
						</Collapse>
					</div>
				</div>
			</div>
		);
	}
});


export default ContentPage;