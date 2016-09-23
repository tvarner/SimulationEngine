import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Application from './app/app';
import MainViewContainer from './app/components/pages/MainView/MainViewContainer';
import AboutPage from './app/components/pages/AboutPage/AboutPage'; // eslint-disable-line import/no-named-as-default
import NotFoundPage from './app/components/pages/NotFound/NotFoundPage';

export default (
	<Route path="/" component={Application}>
		<IndexRoute component={MainViewContainer}/>
		<Route path="about" component={AboutPage}/>
		<Route path="*" component={NotFoundPage}/>
	</Route>
);