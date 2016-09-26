import React, { Component } from 'react';
import './styles.css';

import HoverButton from '../../utilComponents/HoverButton/HoverButton';

// Since this component is simple and static, there's no parent container for it.
export default class HomePage extends Component {

	getGifComponent(url) {
		const attr = 'url(' + url + ') no-repeat center';

		return (
			<div style={{width: '100%', height: '100%'}}>
				<div className={'home-gif-container'} style={{background: attr, backgroundSize: 'cover'}} />
			</div>
		);
	}

	render() {
		const { openAboutPage, openContactPage, openFilmPage, openPhotographyPage, openReelPage, openFeaturePage } = this.props;
		
		const contentMonolith = require('./../../../../content/_content.json');
		const gif1 = contentMonolith.homePage.gif1;
		const gif2 = contentMonolith.homePage.gif2;
		const gif3 = contentMonolith.homePage.gif3;
		const gif4 = contentMonolith.homePage.gif4;
		const gif5 = contentMonolith.homePage.gif5;
		const gif6 = contentMonolith.homePage.gif6;

		return (
			<div style={{ width: '100%', height: '100%'}}>
				<div className={"home-page"}>
					<div className={'left-home-icons'}>
						<div className={"home-page-icon-container"} onClick={openAboutPage}>
							<div className={'mobile-hover-cover'}>Theory</div>
							<HoverButton hoverContent={'Theory'} defaultContent={this.getGifComponent(gif1)} />						
						</div>
						<div className={"home-page-icon-container"} onClick={openPhotographyPage}>
							<div className={'mobile-hover-cover'}>Photography</div>
							<HoverButton hoverContent={'Photography'} defaultContent={this.getGifComponent(gif2)} />	
						</div>
						<div className={"home-page-icon-container"} onClick={openFilmPage}>
							<div className={'mobile-hover-cover'}>Film</div>
							<HoverButton hoverContent={'Film'} defaultContent={this.getGifComponent(gif3)} />	
						</div>
					</div>
					<div className={'right-home-icons'}>
						<div className={"home-page-icon-container"} onClick={openContactPage}>
							<div className={'mobile-hover-cover'}>Connect</div>
							<HoverButton hoverContent={'Connect'} defaultContent={this.getGifComponent(gif4)} />
						</div>
						<div className={"home-page-icon-container"} onClick={openReelPage}>
							<div className={'mobile-hover-cover'}>Reel</div>
							<HoverButton hoverContent={'Reel'} defaultContent={this.getGifComponent(gif5)} />	
						</div>
						<div className={"home-page-icon-container"} onClick={openFeaturePage}>
							<div className={'mobile-hover-cover'}>Feature</div>
							<HoverButton hoverContent={'Feature'} defaultContent={this.getGifComponent(gif6)} />	
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