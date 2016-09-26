import React from 'react';
import _ from 'lodash';

import Collapse from './../../utilComponents/collapse/src/Collapse.jsx';
import Panel from './../../utilComponents/collapse/src/Panel.jsx';
import './styles.css';

import ContentCollectionContainer from './../../utilComponents/ContentCollection/ContentCollectionContainer';
import ContentCollectionHeader from './../../utilComponents/ContentCollectionHeader/ContentCollectionHeader';

// Since this component is simple and static, there's no parent container for it.

const ContentPage = React.createClass({

	getInitialState() {
		const contentMonolith = require('./../../../../content/_content.json');
		const category = this.props.category;

		return {
			contentMonolith: contentMonolith,
			category: category,
			collections: null
		};
	},

	componentWillMount() {
		const collections = this.getCollections(this.state.contentMonolith);
		this.setState({
			collections: collections
		});
	},

	getCollections(contentMonolith) {
		const _contentMonolithQueryFn = function(collection) { 
			const _collectionQueryFn = function(collection) {
				const _categoryQueryFn = function(category) {
					return this.props.category === category;
				};
				return _.find(collection.category, _categoryQueryFn.bind(this));
			};
			return _collectionQueryFn.call(this, collection);
		};

		return _.filter(contentMonolith.collections, _contentMonolithQueryFn.bind(this));
	},

	_checkIfContentCollectionActive(key) {
		for (let i = 0; i <= this.props.page.activePanelKey.length; i++) { 
			if (this.props.page.activePanelKey[i] === key.toString()) { 
				return true;
			}
		}
		return false;
	},

	sortCollectionsByTitle(collections) {
		collections.sort(function(a, b) {
			const titleA = a.name.toUpperCase(); // ignore upper and lowercase
			const titleB = b.name.toUpperCase(); // ignore upper and lowercase
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

	sortCollectionsByAuthor(collections) {
		collections.sort(function(a, b) {
			const authorA = a.authors[0].toUpperCase(); // ignore upper and lowercase
			const authorB = b.authors[0].toUpperCase(); // ignore upper and lowercase
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

	sortCollectionsByDate(collections) { 
		collections.sort(function(a, b) { 
			return new Date(a.dateCreated) - new Date(b.dateCreated); 
		});
	},

	getHeader(carouselRef, content) {
		return (
			<div>
				<ContentCollectionHeader carouselRef={carouselRef} content={content} />
			</div>
		);
	},

	getContentCollection(content, key) {
		const headerCarouselRef = 'headerCarousel' + key.toString();
		const mainCarouselRef = 'mainCarousel' + key.toString();

// add alpha jump ids here: 
		let alphaJumpElementId = 'alpha-jump-no-jump';
		if (this.props.page.sortBy === 'title') {
			// get first character
			const _alphaJumpFirstChar = content.name.charAt(0);
			// check if first character is in provided alphabet array. remove if present. update alphaJumpElementId
			if (_.find(this._alphabet, function(letter) { return (letter === _alphaJumpFirstChar); })) { 
				_.remove(this._alphabet, function(letter) { return (letter === _alphaJumpFirstChar); });
				alphaJumpElementId = 'alpha-jump-' + _alphaJumpFirstChar.toUpperCase();
			}
		} else if (this.props.page.sortBy === 'author') { 
			// get first character
			const _alphaJumpFirstChar = content.authors[0].charAt(0);
			// check if first character is in provided alphabet array. remove if present. update alphaJumpElementId
			if (_.find(this._alphabet, function(letter) { return letter === _alphaJumpFirstChar; })) { 
				_.remove(this._alphabet, function(letter) { return letter === _alphaJumpFirstChar; });
				alphaJumpElementId = 'alpha-jump-' + _alphaJumpFirstChar.toUpperCase();
			}
		}

		if (this._checkIfContentCollectionActive(key)) {
			return (
				<Panel header={this.getHeader(headerCarouselRef, content)} key={key} externalId={alphaJumpElementId}>
					<ContentCollectionContainer carouselRef={mainCarouselRef} content={content} />
				</Panel>
			);
		} else {
			return (
				<Panel header={this.getHeader(headerCarouselRef, content)} key={key} externalId={alphaJumpElementId} />
			);
		}
	},

	getContentCollections() {
		const _collections = this.getCollections(this.state.contentMonolith);

		if (this.props.page.sortBy === 'title') { 
			// sort collections by title
			this.sortCollectionsByTitle(_collections);
		} else if (this.props.page.sortBy === 'date') { 
			// sort collections by date
			this.sortCollectionsByDate(_collections);
		} else if (this.props.page.sortBy === 'author') { 
			// sort collecitons by author
			this.sortCollectionsByAuthor(_collections);
		}
		this._alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
		
		const collections = _collections.map(this.getContentCollection);
		
		if (collections.length === 0) { 
			return (
				<div className={'coming-soon-container'}>
					Coming soon. ;)
				</div>
			);
		}

		return (
			<Collapse
				accordion={this.props.page.accordion}
				onChange={this.props.onChange}
				activeKey={this.props.page.activePanelKey}
			>
				{collections}
			</Collapse>
		);
	},

	render() {
		const _alphaJumpIcons = ["%", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
		
		const _getIconFn = function(icon, i) {
			if (icon === "%") {
				return (
					<div key={i} onClick={this.props.openSortCollectionsModal} className={"alphabetical-jump-icon"}>{icon}</div> 
				);
			}
			
			if (this.props.page.sortBy === 'title' || this.props.page.sortBy === 'author') { 
				const alphaJumpId = 'alpha-jump-' + icon;
				const alphaJumpHandler = function() { 
					if (document.getElementById(alphaJumpId)) { 
						document.getElementById(alphaJumpId).scrollIntoView();
					}
				};

				return (
					<div 
						key={i} 
						className={"alphabetical-jump-icon"}
						onClick={alphaJumpHandler}>
						{icon}
					</div> 
				);
			}
		};

		const getAlphaJumpIcons = _alphaJumpIcons.map(_getIconFn.bind(this));

		return (
			<div style={{ width: '100%' }}>
				<div className={"content-page"}>
					<div className={"alphabetical-jump"}>
						{getAlphaJumpIcons}
					</div>
					<div className={"content-container"}>
						<div className={'header-container'}>{this.props.header}</div>
						{this.getContentCollections()}
					</div>
				</div>
			</div>
		);
	}
});


export default ContentPage;