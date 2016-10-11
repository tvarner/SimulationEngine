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
						<div className={'right-content'}>
							<div className={'text-container'}>
								<a href={"mailto:thomas.g.varner@gmail.com?Subject=Hello"} target="_top">
									<img role={"presentation"} className={'contact-page-instagram-icon'} src={require('./email-icon.png')}/>
								</a>
							</div>
						</div>
						<div className={'right-content'}>
							<div className={'text-container'}>
								<a href={'https://www.linkedin.com/in/thomas-varner-b9847823?trk=hp-identity-name'}>
									<img role={"presentation"} className={'contact-page-instagram-icon'} src={require('./linkedin-icon.png')}/>
								</a>
							</div>
						</div>
						<div className={'right-content'}>
							<div className={'text-container'}>
								<a href={'https://github.com/tvarner'}>
									<img role={"presentation"} className={'contact-page-instagram-icon'} src={require('./github-icon.png')}/>
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
