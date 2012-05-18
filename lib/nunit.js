/*
Copyright (c) 2012 Mario Pareja

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
var run = require('./run').run,
  path = require('path'),
  series = require('./flow').series,
  applyDefaults = require('./options').applyDefaults,
  validateParameters = require('./options').validateParameters,
  parametersSpec = {
    nunitDir: { type: 'string', required: true},
    processor: { type: 'string' },
    subset: { type: 'string' },
    run_options: { type: 'object' },
    extraParameters: { type: 'string' }
  },
  getDefaults = function () { return { processor: 'x86' }; },
  defaults = getDefaults();

var nunit = function (testDlls, opts, callback) {
  if (typeof testDlls === 'string') {
    testDlls = [testDlls];
  }
  if (!Array.isArray(testDlls)) {
    return error('Invallid test assmebly');
  }
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  try {
    options = processOptions(opts);
  } catch (e) {
    return error(e);
  }

  /*jslint white: true */
  var nunitExe;
  options.processor = options.processor || 'x86';
  switch (options.processor) {
    case 'x86': nunitExe = 'nunit-console-x86.exe'; break;
    case 'x64': nunitExe = 'nunit-console.exe'; break;
    default: return error('Invalid processor.');
  }
  /*jslint white: false */

  var nunitPath;
  series(
    function (cb) { path.exists(options.nunitDir, getExistsCallback(cb)); },
    function (cb) {
      nunitPath = path.join(options.nunitDir, nunitExe);
      path.exists(nunitPath, getExistsCallback(cb));
    },
    runTests
  );

  function runTests(err) {
    if (err) { return callback(err); }
    var opts = options.run_options || {};
    if (options.subset) {
      testDlls.push('/run=' + options.subset);
    }
    if (options.extraParameters) {
      testDlls.push(options.extraParameters);
    }
    nunit.run(nunitPath, testDlls, opts, function (code) {
      // return no error if pasesed, otherwise, return code
      callback(code || null);
    });
  }

  function getExistsCallback(callback) {
    return function (exists) {
      callback(exists ? null : 'nunit not found');
    };
  }

  function error(message) {
    process.nextTick(function () { callback(message); });
  }
};
nunit.run = run;

nunit.setDefaults = function (options) {
  defaults = applyDefaults(options, parametersSpec, getDefaults());
};
nunit.resetDefaults = function () {
  defaults = getDefaults();
};

function processOptions(options) {
  var opts = applyDefaults(options, parametersSpec, defaults);
  validateParameters(opts, parametersSpec);
  return opts;
}

module.exports = nunit;
