import React from 'react'
import './styles.css'

import Carousel from 'nuka-carousel'
import contentFileIndex from './../../../../content/_contentFileIndex'

var HorizontalScrollbar = React.createClass({
	displayName: 'HorizontalScrollbar',

	mixins: [Carousel.ControllerMixin],

	getScrollSlides(content) {

		var _getScrollSlidesFn = function(c, i) {
	        if (c.type === "image") {
	        	const src = contentFileIndex[c.url]
	            const key = i;
	            return (
	            	<div className={'scroll-image-container'} key={key}>
	                	<img className={'scroll-image'} data-tag={key} src={src} onClick={this.props.controlCarousel.goToSlide.bind(null, i)} />
	                </div>
	            );
	        } else if (c.type == "video") { 
	      		const key = i;
	            return (
	            	<div className={'scroll-image-container'} key={key} onClick={this.props.controlCarousel.goToSlide.bind(null, i)}>
	            		{c.name}
	            	</div>
	            )  	
	        } else if (c.type === "text") { 

	        } else {
	        	console.log(content);
	        	throw new Error("Invalid content type")
	        }
		}
		var slides = content.content.map(_getScrollSlidesFn.bind(this));

		return slides;
	},

	render() {
		return (
			<div className={"horizontal-scrollbar"}>
				<Carousel
				ref={this.props.carouselRef}
				data={this.setCarouselData.bind(this, this.props.carouselRef)}
				slideIndex={this.state.slideIndex}
				afterSlide={newSlideIndex => this.setState({ slideIndex: newSlideIndex })}
				autoplay={false}
				wrapAround={true} 
				slidesToShow={5}
				slidesToScroll={'auto'}
				decorators={[]}>
					{this.getScrollSlides(this.props.content)}
				</Carousel>
			</div>
		)
	}
})

export default HorizontalScrollbar;