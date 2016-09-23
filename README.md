# Fusion Starter

[![Build status: Linux](https://img.shields.io/travis/cox-auto-kc/fusion-starter.svg?style=flat-square)](https://travis-ci.org/cox-auto-kc/fusion-starter)
[![Build status: Windows](https://ci.appveyor.com/api/projects/status/xrtxiqy55dtj7qe4?svg=true)](https://ci.appveyor.com/project/coryhouse/fusion-starter/branch/master)
[![Dependency Status](https://david-dm.org/cox-auto-kc/fusion-starter.svg?style=flat-square)](https://david-dm.org/cox-auto-kc/fusion-starter)

Fusion Starter is a comprehensive starter kit for rapid application development using React. 

## Demo
[https://fusion-starter.firebaseapp.com](https://fusion-starter.firebaseapp.com)

## Quick Start
First time? [Do the initial machine setup](https://github.com/cox-auto-kc/fusion-starter#initial-machine-setup).
```
git clone https://github.com/cox-auto-kc/fusion-starter.git my-project
cd my-project
npm install
npm start -s
```
This will run the automated build process, run tests, lint, start up a webserver, and open the application in your default browser. 
After running the start command, your code is rebuilt and tests run automatically every time you hit save. [See the full list of commands](https://github.com/cox-auto-kc/fusion-starter/blob/master/faq/FAQ.md#what-do-the-scripts-in-packagejson-do).

Once you're comfortable with how the example app works, remove the example app: `npm run remove-demo`.
Be sure to [enable CORS on the APIs](https://github.com/cox-auto-kc/fusion-starter/blob/master/faq/FAQ.md#how-do-i-call-our-existing-web-apis) you need to call. 

##Why Use this?

1. **One command to get started** - Type `npm start` to start development in your default browser.
2. **Rapid feedback** - Each time you hit save, changes hot reload and linting and automated tests run.
3. **One command line to check** - All feedback is displayed on a single command line.
4. **No more JavaScript fatigue** - Uses the most popular and powerful libraries for working with React.
5. **Working example app** - The included example app shows how this all works together.
6. **Automated production build** - Type `npm run build` to minify and bundle CSS and JS, run tests, lint your code and more.

##Technologies

| **Tech** | **Description** |**Learn More**|
|----------|-------|---|
| [React](https://facebook.github.io/react/)  |   Fast, composable client-side components  |[Thinking in React](https://facebook.github.io/react/docs/thinking-in-react.html) [Pluralsight Courses](https://www.pluralsight.com/search?q=react&categories=course) |
| [React Router](https://github.com/reactjs/react-router) | A complete routing library for React. | |
| [Redux](http://redux.js.org) |  Enforces unidirectional data flows and immutable stores. Useful on larger apps with complex data flows. Alternative to [Facebook's Flux](https://facebook.github.io/flux/docs/overview.html).| [Tutorial Video](https://egghead.io/series/getting-started-with-redux) [Pluralsight Course](https://app.pluralsight.com/library/courses/react-redux-react-router-es6/table-of-contents) [Code-based tutorial](https://github.com/happypoulp/redux-tutorial)   |
| [Babel](http://babeljs.io) |  Compiles ES6 to ES5. Enjoy the new version of JavaScript today     | [ES6 REPL](https://babeljs.io/repl/), [ES6 vs ES5](http://es6-features.org), [ES6 Katas](http://es6katas.org), [Pluralsight course](http://www.pluralsight.com/courses/javascript-fundamentals-es6)    |
| [Webpack](http://webpack.github.io) | Bundles npm packages and our JS into a single file. Supports hot reloading. | [Quick Webpack How-to](https://github.com/petehunt/webpack-howto) [Pluralsight Course](https://www.pluralsight.com/courses/webpack-fundamentals)|
| [BrowserSync](http://www.browsersync.com) | Lightweight development HTTP server that supports synchronized testing and debugging on multiple devices. | [Intro vid](https://www.youtube.com/watch?time_continue=1&v=heNWfzc7ufQ)|
| [Mocha](http://mochajs.org) | Automated tests with [Chai](http://chaijs.com/) for assertions and [Enzyme](https://github.com/airbnb/enzyme) for DOM testing without a browser using Node. | [Pluralsight Course](https://www.pluralsight.com/courses/testing-javascript) |
| [Istanbul](https://github.com/gotwarlost/istanbul) | Code coverage data. Using [Isparta](https://github.com/douglasduteil/isparta) to handle ES6 code. | | | 
| [TrackJS](http://www.trackjs.com) | JavaScript error tracking. Reports available at TrackJS.com. See Cory for credentials | |  
| [ESLint](http://eslint.org/)| Lint JS. Reports syntax and style issues. Using [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react) for additional React specific linting rules. | |
| [SASS](http://sass-lang.com/) | Compiled CSS styles with variables, functions, and more. | [Pluralsight Course](https://www.pluralsight.com/courses/better-css)|
| [PostCSS](http://postcss.org/) | A tool for transforming CSS with JavaScript. We're using [stylelint](http://stylelint.io) to lint styles | | 
| [Editor Config](http://editorconfig.org) | Enforce consistent editor settings (spaces vs tabs, etc). | [IDE Plugins](http://editorconfig.org/#download) |
| [npm Scripts](https://docs.npmjs.com/misc/scripts)| Glues all this together in a handy automated build. | [Pluralsight course](https://www.pluralsight.com/courses/npm-build-tool-introduction), [Why not Gulp?](https://medium.com/@housecor/why-i-left-gulp-and-grunt-for-npm-scripts-3d6853dd22b8#.vtaziro8n)  |

## UI Components
Fusion comes prepackaged with a variety of components to solve for the general needs of developing applications:

| **Tech** | **Description** |
|----------|-------|
|  [React-Bootstrap](https://react-bootstrap.github.io)  |   The most popular front-end framework, rebuilt for React.  Use any Bootstrap 3 theme you like.  Fusion Starter Kit comes with the Tracksuit Bootstrap theme.|
|  [Griddle](http://griddlegriddle.github.io/Griddle/) |  Griddle is a simple grid component for use with React. Griddle ships with filtering, sorting, and paging out of the box.|
|  [Draft.js](https://facebook.github.io/draft-js/) | Draft.js is a framework for building rich text editors in React, powered by an immutable model and abstracting over cross-browser differences.|
|  [D3.js](https://d3js.org/) | D3.js is a JavaScript library for manipulating documents based on data.  D3 helps you bring data to life using HTML, SVG, and CSS.|
|  [React Lazyload](https://github.com/jasonslyvia/react-lazyload) | Lazyload your Component, Image or anything matters the performance.|
|  [React Router Bootstrap](https://github.com/react-bootstrap/react-router-bootstrap) | Integration between React Router and React-Bootstrap.|
|  [React Progress Bar](https://github.com/vn38minhtran/react-progress-bar-plus) | A progress bar component for React.|
|  [React Date Time Picker](https://github.com/quri/react-bootstrap-datetimepicker) | A date time picker for React.|
|  [React Select](http://jedwatson.github.io/react-select/) | A flexible Select Input control for React.|
|  [Entypo Icons](https://github.com/coxautokc/react-entypo) | A React component for the entypo icon library.|
|  [React Font Awesome](https://github.com/danawoodman/react-fontawesome) | A React component for the font-awesome icon library.  Note: This component does not include any of the Font Awesome CSS or fonts, so you'll need to make sure to include those on your end somehow, either by adding them to your build process or linking to CDN versions.|
|  [Tracksuit](http://get-tracksuit.github.io/tracksuit-theme-bootstrap3/docs/) | A Bootstrap 3 theme with enhancements for touch-based devices.|

##Initial Machine Setup

**Mac:**
 1. **Install [Node.js](https://nodejs.org) and [Git](https://git-scm.com/downloads)**. The recommended defaults are fine.
 2. **Configure your Editor**. [Install editorconfig plugin](http://editorconfig.org), [Install React plugin](https://github.com/facebook/react/wiki/Complementary-Tools#jsx-integrations) and [configure your editor](https://github.com/kriasoft/react-starter-kit/blob/master/docs/how-to-configure-text-editors.md).
 3. **Install [React developer tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) and [Redux Dev Tools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en)** in Chrome. (Optional, but helpful)

**Windows:**
 1. **Install [Node.js](https://nodejs.org) and [Git](https://git-scm.com/downloads)**. The recommended defaults are fine.
 2. **Install [Python 2.7](https://www.python.org/downloads/)**. Browser-sync (and various other Node modules) rely on node-gyp, which requires Python on Windows.  
 3. **Install C++ Compiler**. Open Visual Studio and go to File -> New -> Project -> Visual C++ -> Install Visual C++ Tools for Windows Desktop. The C++ compiler is used to compile browser-sync (and perhaps other Node modules).
 4. **Install [React developer tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) and [Redux Dev Tools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en)** in Chrome. (Optional, but helpful)
 5. **Configure your Editor**. [Install editorconfig plugin](http://editorconfig.org), [Install React plugin](https://github.com/facebook/react/wiki/Complementary-Tools#jsx-integrations) and [configure your editor](https://github.com/kriasoft/react-starter-kit/blob/master/docs/how-to-configure-text-editors.md).
 6. **Add two lines to your [Windows hosts file](https://www.rackspace.com/knowledge_center/article/modify-your-hosts-file)** for vinconnect.com: 
```
127.0.0.1 vinconnect.com
127.0.0.1 www.vinconnect.com
```
The api configuration example (in /src/api/api.js) assumes that you're running VinConnect and its APIs locally at vinconnect.com, so these host entries make sure cross origin calls like this succeed: `vinconnect.com/CarDashboard/API/CRMServiceBase/v1/customers/attachments/list?customerId=212746634`

## Questions?
Check out the [FAQ](/faq/FAQ.md)
