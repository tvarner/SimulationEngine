import React from 'react';
import './styles.css';

// Since this component is simple and static, there's no parent container for it.
const AboutPage = () => {
	return (
		<div style={{ height: '100%', width: '100%' }}>
			<div className={'about-page mast-bg-in-out'}>
				<div className={'page-header'}>Theory</div>
				<div className={'page-content'}>
					<div className={'left-content'}>
						<div className={'image-container'}>
							<img role={"presentation"} className={'about-image'} src={'https://media.giphy.com/media/Wkcw6SzOtaSxG/giphy.gif'} />
						</div>
					</div>
					<div className={'right-content'}>
						<div className={'text-container'} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default AboutPage;
