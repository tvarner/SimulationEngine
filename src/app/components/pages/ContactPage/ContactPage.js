import React from 'react';
import './styles.css';

// Since this component is simple and static, there's no parent container for it.
const ContactPage = React.createClass({
	render: function() { 
		return (
			<div style={{ height: '100%', width: '100%' }}>
				<div className={'contact-page'}>
					<div className={'page-header'}>Connect</div>
					<div className={'page-content'}>
						<div className={'left-content'}>
							<div className={'image-container'}>
								<img role={"presentation"} onClick={this.props.openReelPage} className={'contact-page-logo'} src={require('./../../../styles/assets/OfficialLogo.jpg')} />
							</div>
						</div>
						<div className={'middle-content'}>
							<div className={'text-container'}>
								<a className={'contact-page-email-link'} href={"mailto:jonandrebex@gmail.com?Subject=Hello"} target="_top">email</a>
							</div>
						</div>
						<div className={'right-content'}>
							<div className={'text-container'}>
								<a href={'https://www.instagram.com/jon_bex/'}>
									<img role={"presentation"} className={'contact-page-instagram-icon'} src={'http://www.galleriavittoria.com/images/social/instagram.gif'}/>
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

export default ContactPage;
