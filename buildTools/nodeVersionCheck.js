/* eslint-disable */
var exec = require('child_process').exec;
exec('node -v', function (err, stdout, stderr) {
  if (err) throw err;
  if (parseFloat(stdout) < 5) {
    throw new Error('ERROR: Fusion Starter requires Node version 5.0 or greater.');
    process.exit(1);
  }
});
