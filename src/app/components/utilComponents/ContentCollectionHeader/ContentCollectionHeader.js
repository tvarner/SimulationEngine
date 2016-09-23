import React from 'react';
import './styles.css';

import Carousel from 'nuka-carousel'
import contentFileIndex from './../../../../content/_contentFileIndex'

var ContentCollectionHeader = React.createClass({
	displayName: 'ContentCollectionHeader',

	mixins: [Carousel.ControllerMixin],

	getInitialState() { 
		return { 
			slideIndex: 0
		}
	},

	getSlides(content) {
		var slides = content.content.map(function(c, i) {

	        if (c.type === "image") {
	        	const src = contentFileIndex[c.url]
	            const key = i;
	            return (
	                <div className={"collection-header-slide-container"} key={key}>
	                    <img className={"collection-header-slide"} data-tag={key} src={src} />
	                </div>
	            );
	        } else if (c.type == "video") {
	      		const key = i;
	            return (
	            	<div className={"collection-header-slide-container"} key={key}>
	            		{c.name}
	            	</div>
	            )
	        } else if (c.type === "text") { 

	        } else {
	        	console.log(content);
	        	throw new Error("Invalid content type")
	        }
		})

		return slides;
	},

	getAuthors(authors) { 
		return authors.map(function(author, i) { 
			return (
				<span key={i}>
					{author}<span>{" "}</span>
				</span>
			)
		})
	},

	render() {
		return(
			<div className={'collection-header-container'} style={{height: '25vh', width: '100%' }}>
				<div style={{width: '25vh', height: '25vh', margin: 'auto', left: 0, position: 'absolute', 'marginLeft': '40px' }}>
					<Carousel
					ref={this.props.carouselRef}
					data={this.setCarouselData.bind(this, this.props.carouselRef)}
					slideIndex={this.state.slideIndex}
					afterSlide={newSlideIndex => this.setState({ slideIndex: newSlideIndex })}
					autoplay={true}
					wrapAround={true}
					decorators={[]}>
						{this.getSlides(this.props.content)}
					</Carousel>
				</div>
				<div className={'collection-header-collection-info'}>
					<div className={'collection-header-collection-title'}>{this.props.content.name}</div>
					<div className={'collection-header-collection-authors'}>
						<span>{" "}</span>
						{this.getAuthors(this.props.content.authors)}
					</div>
					<div className={'collection-header-collection-description'}>
						{this.props.content.description}
					</div>
				</div>
			</div>
		)
	}
});

export default ContentCollectionHeader;