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
var ensureParameterSet = require('./common').ensureParameterSet,
  run = require('./paprika').run,
  path = require('path'),
  applyDefaults = require('./options.js').applyDefaults,
  validateParameters = require('./options.js').validateParameters,
  parametersSpec = {
    virtualPath: { type: 'string', required: true },
    physicalPath: { type: 'string', required: true },
    processor: { type: 'string', required: true },
    version: { type: 'string', required: true },
    targetPath: { type: 'string' },
    updatable: { type: 'boolean' },
    debug: { type: 'boolean' },
    run_options: { type: 'object' }
  },
  getDefaults = function () {
    return {
      updatable: false,
      debug: false
    };
  },
  defaultOptions = getDefaults();

exports.aspcompile = function (options, callback) {
  var opts = processOptions(options, defaultOptions),
    exe = findCompilerExe(opts.version, opts.processor),
    args = [
      '-v',
      opts.virtualPath,
      '-p',
      opts.physicalPath,
      opts.updatable ? '-u' : '',
      opts.debug ? '-d -errorstack' : '',
      '-nologo',
      opts.targetPath || ''
    ];

  if (process.platform !== 'win32') {
    throw new Error('FAILED: ASP.NET Compilation is only supported on Windows.');
  }

  exports.aspcompile.run(exe, args, opts.run_options, callback || defaultCallback);

  function defaultCallback(code) {
    if (code !== 0) {
      throw new Error('FAILED: ASP.NET Compilation.');
    }
  }
};

exports.aspcompile.setDefaults = function (options) {
  defaultOptions = applyDefaults(options, parametersSpec, getDefaults());
};
exports.aspcompile.resetDefaults = function () {
  defaultOptions = getDefaults();
};

// open up seam for testing
exports.aspcompile.run = run;

function processOptions(options) {
  var opts = applyDefaults(options, parametersSpec, defaultOptions);
  validateParameters(opts, parametersSpec);

  return opts;
}

var findCompilerExe = (function () {
  var processors = {
      'x86': 'Framework',
      'x64': 'Framework64'
    },
    versions = {
      'net1.0': '1.0.3705',
      'net10': '1.0.3705',
      'net1.1': '1.1.4322',
      'net11': '1.1.4322',
      'net2.0': '2.0.50727',
      'net20': '2.0.50727',
      'net3.5': '2.0.50727',
      'net35': '2.0.50727',
      'net4.0': '4.0.30319',
      'net40': '4.0.30319'
    };

  return function (version, processor) {
    var theVersion = versions[version],
      theProcessor = processors[processor];

    if (!theVersion || !theProcessor) {
      throw new Error("Invalid .NET framework version '" + version + "' or processor '" + processor + "'");
    }

    return path.join(process.env.WINDIR, 'Microsoft.Net', theProcessor, 'v' + theVersion, "aspnet_compiler.exe");
  };
}());
