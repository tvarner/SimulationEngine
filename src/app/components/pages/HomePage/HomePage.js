import React, { Component, PropTypes } from 'react'
import {Link} from 'react-router';
import './styles.css';

import HoverButton from '../../utilComponents/HoverButton/HoverButton'

// Since this component is simple and static, there's no parent container for it.
export default class HomePage extends Component {

	getGifComponent(url) {
		var attr = 'url(' + url + ') no-repeat center';

		return (
			<div style={{width: '100%', height: '100%'}}>
				<div 
					className={'home-gif-container'}
					style={
						{
							background: attr, 
							backgroundSize: 'cover'
						}
					}>
				</div>
			</div>
		)
	}

	render() {
		const { openHomePage, openAboutPage, openContactPage, openFilmPage, openPhotographyPage, openReelPage, openFeaturePage } = this.props;

		return (
			<div style={{ width: '100%', height: '100%'}}>
				<div className={"home-page"}>
					<div className={'left-home-icons'}>
						<div className={"home-page-icon-container"} onClick={openAboutPage}>
							<div className={'mobile-hover-cover'}>Theory</div>
							<HoverButton hoverContent={'Theory'} defaultContent={this.getGifComponent("https://media.giphy.com/media/dtbB41relo3N6/giphy.gif")} />						
						</div>
						<div className={"home-page-icon-container"} onClick={openPhotographyPage}>
							<div className={'mobile-hover-cover'}>Photography</div>
							<HoverButton hoverContent={'Photography'} defaultContent={this.getGifComponent("https://media.giphy.com/media/tarn31SCK2v1S/giphy.gif")} />	
						</div>
						<div className={"home-page-icon-container"} onClick={openFilmPage}>
							<div className={'mobile-hover-cover'}>Film</div>
							<HoverButton hoverContent={'Film'} defaultContent={this.getGifComponent("https://media.giphy.com/media/10W46ufXb3PzZS/giphy.gif")} />	
						</div>
					</div>
					<div className={'right-home-icons'}>
						<div className={"home-page-icon-container"} onClick={openContactPage}>
							<div className={'mobile-hover-cover'}>Connect</div>
							<HoverButton hoverContent={'Connect'} defaultContent={this.getGifComponent("https://media.giphy.com/media/1EpaY72a3fmfHcE8/giphy.gif")} />
						</div>
						<div className={"home-page-icon-container"} onClick={openReelPage}>
							<div className={'mobile-hover-cover'}>Reel</div>
							<HoverButton hoverContent={'Reel'} defaultContent={this.getGifComponent("https://media.giphy.com/media/kVxifQzsa0iIM/giphy.gif")} />	
						</div>
						<div className={"home-page-icon-container"} onClick={openFeaturePage}>
							<div className={'mobile-hover-cover'}>Feature</div>
							<HoverButton hoverContent={'Feature'} defaultContent={this.getGifComponent("https://media.giphy.com/media/UFExlG0VnJRGo/giphy.gif")} />	
						</div>
					</div>
				</div>
				<div className={"footer grow"}>
					<HoverButton onClick={openContactPage} defaultContent={'Jonathan Andre Beckles & Company'} hoverContent={'Connect'} />
				</div>
			</div>
		);
	}
}