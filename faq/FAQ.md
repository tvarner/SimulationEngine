##FAQ
###Why does this exist?
This starter kit implements best practices like testing, minification, bundling, and so on. It codifies a long list of decisions that you no longer have to make to get rolling. It also saves you from the long, painful process of wiring it all together into an automated dev environment.

###What do the scripts in package.json do?
Unfortunately, scripts in package.json can't be commented inline because the JSON spec doesn't support comments, so I'm providing info on what each script in package.json does here.  

| **Script** | **Description** |
|----------|-------|
| remove-demo | Removes the demo application so you can begin development. |
| prestart | Runs automatically before start. Calls remove-dist script which deletes the dist folder. This helps remind you to run the build script before committing since the dist folder will be deleted if you don't. ;) |
| start | Runs tests, lints, starts dev webserver, and opens the app in your default browser. |
| lint:tools | Runs ESLint on build related JS files. (eslint-loader lints src files via webpack when `npm start` is run) |
| clean-dist | Removes everything from the dist folder. |
| remove-dist | Deletes the dist folder. |
| create-dist | Creates the dist folder and the necessary subfolders. |
| prebuild | Runs automatically before build script (due to naming convention). Cleans dist folder, builds html, and builds sass. |
| build | Bundles all JavaScript using webpack and writes it to /dist. These are the files you'll deploy to production.|
| test | Runs tests (files ending in .spec.js) using Mocha and outputs results to the command line. Watches all files so tests are re-run upon save. |
| test:cover | Display test coverage |
| open:cover | Open test coverage report in default browser |

###What command line should I use?
Whatever you like. This kit works on Windows, Mac, and Linux.

###How do I keep my app updated with the latest features of the starter kit?
Assuming your project isn't using Git itself, you can clone this repo to get started. Then, anytime you want to get the latest version of this repo, type `git pull` on the command line in the root of your project. This will merge in all updates.

###Can you explain the folder structure?
**Note that the files that start with a dot below will be hidden by default in Windows.** [Here's how to see them](http://windows.microsoft.com/en-us/windows/show-hidden-files#show-hidden-files=windows-7). Or type `ls -la` in Git Bash.
```
.
├── .babelrc                  # Configures Babel
├── .editorconfig             # Configures editor rules
├── .eslintrc                 # Configures ESLint
├── .gitignore                # Tells git which files to ignore
├── .istanbul.yml             # Configure istanbul code coverage
├── .npmrc                    # Configures npm to save exact by default
├── .stylelintrc              # Configures stylelint.
├── README.md                 # This file.
├── assets                    # Folder where you will store images, documents, or other other files.
├── buildTools                # Node scripts that run build related tools
│   ├── baseUrl.js            # Sets the baseUrl based on runtime environment
│   ├── build.js              # Runs the production build
│   ├── buildHtml.js          # Builds index.html
│   ├── chalkConfig.js        # Configure colored command line output
│   ├── distServer.js         # Starts webserver and opens final built app that's in dist in your default browser
│   ├── removeDemo.js         # Remove the demo app so you can begin development
│   ├── srcServer.js          # Starts dev webserver with hot reloading and opens your app in your default browser
│   ├── startMessage.js       # Displays a message to the command line when starting the app.
│   ├── testSetup.js          # Configures Mocha.
├── dist                      # Folder where the build script places the built app. Use this in prod.
├── package.json              # Package configuration. The list of 3rd party libraries and utilities
├── src                       # The actual application's source code. 
│   ├── actions               # Redux actions. List of distinct actions that can occur in the app.  
│   ├── api                   # Centralized place to make AJAX calls. Includes example call.
│   ├── components            # React components
│   ├── containers            # App container for Redux
│   ├── favicon.ico           # favicon to keep your browser from throwing a 404 during dev. Not actually used in prod build.
│   ├── index.html            # Start page
│   ├── index.js              # Entry point for your app
│   ├── reducers              # Redux reducers. Your state is altered here based on actions
│   ├── store                 # Redux store configuration
│   ├── styles                # CSS Styles, typically written in Sass
│   └── utils                 # Plain old JavaScript. Pure logic. No framework specific code here. Think "business layer".
└── webpack.config.dev.js     # Configures webpack for development
└── webpack.config.prod.js    # Configures webpack for production
```

### What are the dependencies in package.json used for?
| **Dependency** | **Use** |
|----------|-------|
|connect-history-api-fallback  | Support reloading deep links |
|object-assign | Polyfill for Object.assign |
|react|React library |
|react-dom|React library for DOM rendering |
|react-redux|Redux library for connecting React components to Redux |
|react-router|React library for routing |
|react-bootstrap|Bootstrap rebuilt for React |
|redux|Library for unidirectional data flows |
|babel-cli|Babel Command line interface |
|babel-core|Babel Core for transpiling the new JavaScript to old |
|babel-eslint|Connects Babel and ESLint so experimental (stage-2) JS code that isn't yet supported by ESLint can be linted. |
|babel-loader|Adds Babel support to Webpack |
|babel-preset-latest|Babel preset for transpiling ES2015/16 to ES5|
|babel-plugin-react-display-name| Add displayName to React.createClass calls |
|babel-preset-stage-2|Babel preset for transpiling stage 2 features to ES5|
|babel-plugin-transform-react-constant-elements | Performance optimization: Hoists the creation of elements that are fully static to the top level. reduces calls to React.createElement and the resulting memory allocations. [More info](https://medium.com/doctolib-engineering/improve-react-performance-with-babel-16f1becfaa25#.2wbkg8g4d) |
|babel-plugin-transform-react-remove-prop-types | Remove propTypes for prod build (saves bandwidth since they're not run anyway) |
|babel-preset-react-hmre|Hot reloading preset for Babel|
|babel-preset-react| Add JSX support to Babel |
|browser-sync| Supports synchronized testing on multiple devices and serves local app on public URL |
|chai|Assertion library for use with Mocha|
|chalk|Adds color support to terminal |
|connect-history-api-fallback|Supports reloading deep links on the client|
|coveralls|Display code coverage on Github via badge|
|cross-env|Cross-environment friendly way to handle environment variables|
|css-loader|Add CSS support to Webpack|
|enzyme|Simplified JavaScript Testing utilities for React|
|eslint|Lints JavaScript |
|eslint-loader|Adds ESLint support to Webpack |
|eslint-plugin-a11y|Adds accessibility related rules to eslint|
|eslint-plugin-import|Validates ES6 imports|
|eslint-plugin-react|Adds additional React-related rules to ESLint|
|extract-text-webpack-plugin| Extracts CSS into separate file for production build |
|file-loader| Adds file loading support to Webpack |
|glob|For match files via wildcards|
|griddle-react|Griddle is a simple grid component for use with React|
|html-webpack-plugin|Generates custom index.html for each environment as part of webpack build|
|isparta|Code coverage tool that wraps Istanbul to add ES6 support|
|mocha| JavaScript testing library |
|postcss| Tool for transforming styles with JS plugins |
|postcss-cssnext| Use tomorrow’s CSS syntax, today |
|postcss-import| PostCSS plugin to import CSS files |
|postcss-loader| PostCSS loader for webpack |
|postcss-url| PostCSS plugin to rebase or inline on url|
|node-sass| Adds SASS support to Webpack |
|npm-install-webpack-plugin|Automatically install missing dependencies|
|npm-run-all| Run multiple scripts at the same time |
|parallelshell| Display results of multiple commands on single command line |
|react-addons-test-utils| Adds React TestUtils |
|redux-immutable-state-invariant| Throw error when you mutate Redux store state|
|rimraf|Delete files |
|sass-loader| Adds Sass support to Webpack|
|sinon| Standalone test spies, stubs and mocks for JavaScript |
|sinon-chai| Extends Chai with assertions for the Sinon.JS mocking framework|
|style-loader| Add Style support to Webpack |
|stylelint| Modern CSS linter |
|stylelint-config-standard| Standard shareable config for stylelint |
|stylelint-selector-bem-pattern| A stylelint plugin that harnesses the power of postcss-bem-linter |
|stylelint-webpack-plugin| stylelint plugin for webpack |
|webpack| Bundler with plugin system and integrated development server |
|webpack-dev-middleware| Used to integrate Webpack with Browser-sync |
|webpack-hot-middleware| Use to integrate Webpack's hot reloading support with Browser-sync |
|webpack-md5-hash| Hash bundles, and use the hash for the filename so that the filename only changes when contents change|

### Where are the files being served from when I run `npm start`?
Webpack serves your app in memory when you run `npm start`. No physical files are written. However, the web root is /src, so you can reference files under /src in index.html. When the app is built using `npm run build`, physical files are written to /dist and the app is served from /dist.

### Where is index.html?
It's generated by webpack using htmlWebpackPlugin. This plugin dynamically generates index.html based on the configuration in webpack.config. It also adds references to the JS and CSS bundles using hash-based filenames to bust cache. Separate bundles for vendor and application code are created and referencing within the generated index.html file so that vendor libraries and app code can be cached separately by the browser. The bundle filenames are based on the file's hash, so the filenames only change when the file contents change. For more information on this, read [Long-term caching of static assets with Webpack](https://medium.com/@okonetchnikov/long-term-caching-of-static-assets-with-webpack-1ecb139adb95#.4aeatmtfz) and [html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin)

### How is cssnext being transpiled into CSS and landing in the browser?
It is handled differently in dev (`npm start`) vs prod (`npm run build`)

When you run `npm start`:

 1. The postcss-loader uses the cssnext module that transcompiles to CSS.
 2. Webpack bundles the compiled CSS into bundle.js.
 3. bundle.js contains code that loads styles into the &lt;head&gt; of index.html via JavaScript. This is why you don't see a stylesheet reference in index.html. In fact, if you disable JavaScript in your browser, you'll see the styles don't load either.

The approach above supports hot reloading, which is great for development. However, it also create a flash of unstyled content on load because you have to wait for the JavaScript to parse and load styles before they're applied. So for the production build, we use a different approach:

When you run `npm run build`:

 1. The postcss-loader uses the cssnext module to transcompile into CSS.
 2. The [extract-text-webpack-plugin](https://github.com/webpack/extract-text-webpack-plugin) extracts the compiled cssnext into styles.css.
 3. buildHtml.js adds a reference to the stylesheet to the head of index.html.

For both of the above methods, a separate sourcemap is generated for debugging in [compatible browsers](http://thesassway.com/intermediate/using-source-maps-with-sass).

### I don't like the cssnext. I simply want to use a CSS file.
No problem. Reference your CSS file in index.html, and add a step to the build process to copy your CSS file over to the same relative location /dist as part of the build step. But be forewarned, you lose style hot reloading with this approach.

###How do I call our existing Web APIs?
This starter kit uses a Node based webserver (Webpack's dev server combined with Browsersync). This means you need to enable Cross-origin Resource Sharing (CORS) on any existing IIS hosted APIs so that you can call them from this kit's dev web server. Here's how:  

Add this to your API's Global.asax:
```c#
protected void Application_BeginRequest(object sender, EventArgs e)
{
    EnableCrossOriginRequestsFromLocalhost(HttpContext.Current.Request);
}

/// <summary>
/// Enables calling IIS-based webservices on localhost from a separate webserver.
/// Useful for doing front-end development from a separate webserver such as a Node-based webserver.
/// </summary>
/// <param name="request"></param>
private void EnableCrossOriginRequestsFromLocalhost(HttpRequest request)
{
    if (!HttpContext.Current.Request.IsLocal) return;
    if (request.UrlReferrer == null) return; //can't set Access-Control-Allow-Origin header reliably without a referrer so just return. Referrer should always be set when being called from an app under development because the app under development's URL will be sent as the referrer automatically.
    var response = HttpContext.Current.Response;
    response.AddHeader("Access-Control-Allow-Origin", request.UrlReferrer.GetLeftPart(UriPartial.Authority));
    response.AddHeader("Access-Control-Allow-Credentials", "true");
    if (request.HttpMethod == "OPTIONS")
    {
        response.AddHeader("Access-Control-Allow-Methods", "POST, PUT, DELETE");
        response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
        response.AddHeader("Access-Control-Max-Age", "1728000");
        response.End();
    }
}
```
The example project includes /api/api.js. This file uses Axios to make AJAX calls. It's recommended to centralize your API calls there. See the example in api.js. api.js properly sets the base url based on whether it's running locally, but be sure to add a hosts entry for vinconnect.com (as outlined in the initial machine setup) to assure it works properly.

### I just want an empty starter kit.
This starter kit includes an example app so you can see how everything hangs together on a real app. When you're done reviewing it, run this to remove the demo app:

  ```npm run remove-demo```

Don't want to use Redux? See the next question for some steps on removing Redux.

### Do I have to use Redux?
Nope. Redux is useful for applications with more complex data flows. If your app is simple, Redux is overkill. Remove Redux like this:

 1. Run `npm run remove-demo`
 2. Uninstall Redux related packages: `npm uninstall redux react-redux redux-thunk`
 3. Create a new empty component in /components.
 4. Call render on the new top level component you created in step 3 in src/index.js.

### How do I remove React Router?
 1. Uninstall React Router and routing related packages: `npm uninstall --save react-router connect-history-api-fallback`
 2. Delete the following files: `src/routes.js`
 3. Remove `import { Link, IndexLink } from 'react-router';` from top of `src/components/App.js`, add a reference to `src/components/FuelSavingsForm.js`, and replace body of (implicit) render with this: `<FuelSavingsPage />`.

### How do I deploy this?
Type `npm run build`. This will setup the project for production. It does the following:
* Minifies all JS.
* Sets NODE_ENV to prod so that React is built in production mode.
* Places the resulting built project files into /dist. (This is the folder you'll expose to the world).

### Why are test files placed alongside the file under test (instead of centralized)?
Streamlined automated testing is a core feature of this starter kit. All tests are placed in files that end in .spec.js. Spec files are placed in the same directory as the file under test. Why?
+ The existence of tests is highly visible. If a corresponding .spec file hasn't been created, it's obvious.
+ Easy to open since they're in the same folder as the file being tested.
+ Easy to create new test files when creating new source files.
+ Short import paths are easy to type and less brittle.
+ As files are moved, it's easy to move tests alongside.

### How do I view code coverage?
Code coverage is calculated and reported via Istanbul. To view your current code coverage, run `npm run open-coverage`. This will open a tab in your default browser which displays code coverage statistics. You can optionally update the npm script config to run your code coverage on the command line each time you hit save.

### How do I debug?
Since browsers don't currently support all of ES6, we're using Babel to compile ES6 down to ES5. This means the code that runs in the browser looks different than what we wrote. But good news, a [sourcemap](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/) is generated to enable easy debugging. This means your original JS source will be displayed in your browser's dev console.
<img width="1280" alt="screen shot 2016-06-07 at 2 18 24 pm" src="https://cloud.githubusercontent.com/assets/1688997/15871653/68113838-2cbb-11e6-89d9-095a12bf91b1.png">

*Note:* When you run `npm start`, no JS is minified. Why? Because minifying slows the build. So JS is only minified when you run the `npm run build` script. See [more on building for production below](https://github.com/coryhouse/vin-javascript-starter-kit#how-do-i-deploy-this).

Also note that no actual physical files are written to the filesystem during the dev build. **For performance, all files exist in memory when served from the webpack server.**. Physical files are only written when you run `npm run build`.

**Tips for debugging via sourcemaps:**

 1. Browsers vary in the way they allow you to view the original source. Chrome automatically shows the original source if a sourcemap is available. Safari, in contrast, will display the minified source and you'll [have to cmd+click on a given line to be taken to the original source](http://stackoverflow.com/questions/19550060/how-do-i-toggle-source-mapping-in-safari-7).  
 2. Do **not** enable serving files from your filesystem in Chrome dev tools. If you do, Chrome (and perhaps other browsers) may not show you the latest version of your code after you make a source code change. Instead **you must close the source view tab you were using and reopen it to see the updated source code**. It appears Chrome clings to the old sourcemap until you close and reopen the source view tab. To clarify, you don't have to close the actual tab that is displaying the app, just the tab in the console that's displaying the source file that you just changed.  
 3. If the latest source isn't displaying the console, force a refresh. Sometimes Chrome seems to hold onto a previous version of the sourcemap which will cause you to see stale code.

### Why does the build use npm scripts instead of Gulp or Grunt?
In short, Gulp is an unnecessary abstraction that creates more problems than it solves. [Here's why](https://medium.com/@housecor/why-i-left-gulp-and-grunt-for-npm-scripts-3d6853dd22b8#.vtaziro8n).

### Why does package.json reference the exact version?
This assures that the build won't break when some new version is released. Unfortunately, many package authors don't properly honor [Semantic Versioning](http://semver.org), so instead, as new versions are released, I'll test them and then introduce them into the starter kit. But yes, this means when you do `npm update` no new dependencies will be pulled down. You'll have to update package.json with the new version manually.

### How do I handle images?
Via <a href="https://github.com/webpack/file-loader">Webpack's file loader</a>. Example: 

```
<img src={require('./assets/images/myImage.jpg')} />

```

Webpack will then intelligently handle your image for you. For the production build, it will copy the physical file to /dist and insert the appropriate path in your image tag.

### I'm getting an error when running npm install: Failed to locate "CL.exe"
On Windows, you need to install extra dependencies for browser-sync to build and install successfully. Follow the getting started steps above to assure you have the necessary dependencies on your machine.

### How do I kill the watch process on the Windows command line?
If you're in Webstorm, click the red x next to the terminal and then hit Alt+F12 to reopen the terminal. Unfortunately, Ctrl+C doesn't seem to work on the windows command line. (Another reason why I recommend using Git Bash).

### I can't access the external URL for Browsersync
To hit the external URL, all devices must be on the same LAN. So this means your dev machine needs to be on Wifi (since you likely can't connect any tablet or phone to Ethernet. If you dev machine is on wired ethernet, it's on a separate LAN from the Wifi so the two devices won't be able to communicate.

### What about the Redux Devtools?
Install the [Redux devtools extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en) in Chrome Developer Tools. If you're interested in running Redux dev tools cross-browser, Barry Staes created a [branch with the devtools incorporated](https://github.com/coryhouse/react-slingshot/pull/27).

### Hot reloading isn't working!
Hot reloading doesn't always play nicely with stateless functional components at this time. [This is a known limitation that is currently being worked](https://github.com/gaearon/babel-plugin-react-transform/issues/57). To avoid issues with hot reloading for now, use a traditional class-based React component at the top of your component hierarchy.
