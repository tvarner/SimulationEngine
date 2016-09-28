import React from 'react';
import './styles.css';

import Carousel from 'nuka-carousel';
import contentFileIndex from './../../../../content/_contentFileIndex';

const HorizontalScrollbar = React.createClass({
	displayName: 'HorizontalScrollbar',

	getInitialState() {
		return {
			carousels: {}
		};
	},

	goToSlideHandler(i) {
		if(this.props.controlCarousel) { 
			return this.props.controlCarousel.goToSlide.call(null, i);
		}
	},

	getScrollSlides(content) {
		const _getScrollSlidesFn = function(c, i) {
			if (c.type === "image") {
				const src = contentFileIndex[c.url];
				const key = i;
				return (
					<div className={'scroll-image-container'} key={key}>
						<img role={"presentation"} className={'scroll-image'} data-tag={key} src={src} onClick={
							this.goToSlideHandler.bind(null, i)} />
					</div>
				);
			} else if (c.type === "video") { 
				const key = i;
				return (
					<div className={'scroll-image-container'} key={key} onClick={
						this.goToSlideHandler.bind(null, i)}>
						{c.name}
					</div>
				);
			} else if (c.type === "text") { 
				return <div />;
			} else {
				throw new Error("Invalid content type");
			}
		};

		const slides = content.content.map(_getScrollSlidesFn.bind(this));
		return slides;
	},

	setCarouselData(carousel) { 
		const data = this.state.carousels;
		data[carousel] = this.refs[carousel];
		this.setState({
			carousels: data
		});
	},

	getAfterSlideFn() { 
		const _getAfterSlideFn = function(newSlideIndex) { 
			this.setState({ slideIndex: newSlideIndex }); 
		};
		return _getAfterSlideFn;
	},

	render() {
		return (
			<div className={"horizontal-scrollbar"}>
				<Carousel
				ref={this.props.carouselRef}
				data={this.setCarouselData.bind(this, this.props.carouselRef)}
				slideIndex={this.state.slideIndex}
				afterSlide={this.getAfterSlideFn().bind(this)}
				autoplay={false}
				wrapAround={true} 
				slidesToShow={5}
				slidesToScroll={'auto'}
				decorators={[]}>
					{this.getScrollSlides(this.props.content)}
				</Carousel>
			</div>
		);
	}
});

export default HorizontalScrollbar;