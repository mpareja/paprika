var run = require('./run').run,
  path = require('path'),
  series = require('./flow').series,
  defaults = {},
  run = require('./paprika').run;

module.exports = function (testDlls, options, callback) {
  if (typeof testDlls === 'string') {
    testDlls = [testDlls];
  }
  if (!Array.isArray(testDlls)) {
    return callback('Invallid test assmebly');
  }
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }

  var nunit;
  series(
    function (cb) { path.exists(options.nunitDir, getExistsCallback(cb)); },
    function (cb) {
      nunit = path.join(options.nunitDir, 'nunit-console-x86.exe');
      path.exists(options.nunitDir, getExistsCallback(cb));
    },
    runTests
  );

  function runTests(err) {
    if (err) { return callback(err); }
    var opts = options.run_options || {};
    if (options.subset) {
      testDlls.push('/run=' + options.subset);
    }
    run(nunit, testDlls, opts, function (code) {
      // return no error if pasesed, otherwise, return code
      callback(code || null);
    });
  }

  function getExistsCallback(callback) {
    return function (exists) {
      callback(exists ? null : 'nunit not found');
    };
  }
};
