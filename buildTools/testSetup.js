// This file is written in ES5 since it's not transpiled by Babel.
/* eslint-disable no-var */
var glob = require('glob');

// 1. Register babel for transpiling our code for testing
require('babel-register')();

// 2. Set NODE_ENV to production
// This assures the .babelrc dev config (which includes
// hot module reloading code) doesn't apply for tests.
process.env.NODE_ENV = 'test';

// 3. Warn if no test files are found. Mocha will present a cryptic message otherwise.
glob('src/**/*.spec.js', {}, function (err, files) {
  if (files.length === 0) {
    console.warn('No tests found in the src directory. Create at least one test file in the src directory ending in .spec.js. Or, disable tests.'); // eslint-disable-line no-console
    process.exit(1); // Return 1 to signify failure and stop additional processing
  }
});

// 4. Disable webpack-specific features for tests since
// Mocha doesn't know what to do with them.
['.css', '.scss', '.png', '.jpg'].forEach(ext => {
  require.extensions[ext] = () => null;
});

// 5. Setup simulated browser environment for jsdom (Used by Enzyme)
global.document = require('jsdom').jsdom('<body></body>');
global.window = document.defaultView;
global.navigator = window.navigator;
