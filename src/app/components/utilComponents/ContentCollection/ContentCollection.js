import React from 'react';

import contentFileIndex from './../../../../content/_contentFileIndex';
import ReactPlayer from 'react-player'

import Carousel from 'nuka-carousel';
import HorizontalScrollbar from '../HorizontalScrollbar/HorizontalScrollbar';
import VideoContentInfo from '../VideoContentInfo/VideoContentInfo'

var ContentCollection = React.createClass({
	displayName: 'ContentCollection',

	mixins: [Carousel.ControllerMixin],

	getSlides(content) {

		var _getSlidesFn = function(c, i) {
			if (c.type === "image") {
				const src = contentFileIndex[c.url]
				const key = i;
				this.slideContent = c;
				return (
					<div 
						className={'content-image-container'} 
						key={key}>
						<div 
							className={'content-info-icon'}
							onClick={this.props.openFullScreenContentModal.bind(this, this.slideContent)}>
							INFO
						</div>
						<img className={'collection-image'} data-tag={key} src={src} />
					</div>
				);
			} else if (c.type == "video") {
				const key = i;
				return (
					<div
						className={'content-video-container'}
						key={key}>
						<VideoContentInfo content={content} />
						<ReactPlayer url={c.url} playing={false} />
					</div>
				)               
			} else if (c.type === "text") { 

			} else {
				console.log(content);
				throw new Error("Invalid content type")
			}
		}
		var slides = content.content.map(_getSlidesFn.bind(this));

		return slides;
	},

	getControlCarousel() { 
		if(this.state.carousels[this.props.carouselRef]) { 
			return this.state.carousels[this.props.carouselRef];
		}
	},

	getDecorators() {
		var Decorators = [
		  {
			component: React.createClass({
			  render() {
				return (
				  <div>
					<div className={'content-collection-slider-button'} onClick={this.props.previousSlide} aria-hidden="true">PREV</div>
				  </div>
				)
			  }
			}),
			position: 'CenterLeft',
			style: {
			  padding: 20
			}
		  },
		  {
			component: React.createClass({
			  render() {
				return (
				  <div>
					<div className={'content-collection-slider-button'} onClick={this.props.nextSlide} aria-hidden="true">NEXT</div>
				  </div>
				)
			  }
			}),
			position: 'CenterRight',
			style: {
			  padding: 20
			}
		  }
		];
		return Decorators;
	},

	render: function () {
		return (
			<div>
				<Carousel
				ref={this.props.carouselRef}
				data={this.setCarouselData.bind(this, this.props.carouselRef)}
				slideIndex={this.state.slideIndex}
				afterSlide={newSlideIndex => this.setState({ slideIndex: newSlideIndex })}
				autoplay={false}
				wrapAround={true}
				decorators={this.getDecorators()}>
					{this.getSlides(this.props.content)}
				</Carousel>
				<HorizontalScrollbar 
					content={this.props.content} 
					carouselRef={this.props.carouselRef + '_scroll'}
					controlCarousel={this.getControlCarousel()} />
			</div>
		);
	}
});

export default ContentCollection;