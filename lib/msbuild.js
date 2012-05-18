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
var path = require('path'),
  run = require('./run'),
  applyDefaults = require('./options').applyDefaults,
  validateParameters = require('./options').validateParameters,
  fail = fail || function (message) {
    throw new Error(message);
  };

module.exports = (function () {
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
      'net3.5': '3.5',
      'net35': '3.5',
      'net4.0': '4.0.30319',
      'net40': '4.0.30319'
    },
    defaults = getPaprikaDefaults();

  var buildPath = function (version, processor) {
    var theVersion = versions[version],
      theProcessor = processors[processor];

    if (!theVersion || !theProcessor) {
      fail("Invalid .NET framework version '" + version + "' or processor '" + processor + "'");
      return;
    }

    return path.join(process.env.WINDIR, 'Microsoft.Net', theProcessor, 'v' + theVersion, "MSBuild.exe");
  };

  var getProperties = function (properties) {
    if (!properties) {
      return '';
    }
    var result = '',
      prop;
    for (prop in properties) {
      if (properties.hasOwnProperty(prop) && typeof properties[prop] === 'string') {
        if (result !== '') {
          result += ';';
        }
        result += prop + '=' + properties[prop];
      }
    }
    return '/p:' + result;
  };

  var processOptions = function (options) {
    if (!options) {
      fail('Missing MSBuild options.');
    }

    var opts = applyBuildDefaults(options, defaults);
    validateParameters(opts, parametersSpec);
    return opts;
  };

  var stripNewline = function (str) {
    if (!str) {
      return '';
    }
    return str.replace(/\n$/, '');
  };

  var msb = function (options, callback) {
    var opts = processOptions(options);

    var msbuildPath = buildPath(opts.version, opts.processor),
      args = [
        opts.file,
        '/t:' + opts.targets.join(';'),
        getProperties(opts.properties),
      ],
      handle;

    if (opts.extraParameters) {
      args.push(opts.extraParameters);
    }

    if (opts.buildCommand) {
      msbuildPath = opts.buildCommand;
    }

    run(msbuildPath, args, onExit, {
      stdout: opts.stdout,
      stderr: opts.stderr
    });

    function onExit(code) {
      if (code !== 0) {
        fail('Running MSBuild failed with error code: ' + code);
      }
      if (callback) {
        callback();
      }
    }
  };

  function getPaprikaDefaults() {
    return {
      stdout: true,
      stderr: true,
      processor: 'x86',
      targets: ['Build']
    };
  }

  var parametersSpec = {
    file: { type: 'string', required: true },
    stdout: { type: 'boolean' },
    stderr: { type: 'boolean' },
    processor: { type: 'string' },
    targets: { type: 'array' },
    properties: { type: 'object' },
    buildCommand: { type: 'string' },
    extraParameters: { type: 'string' },
    version: { type: 'string', required: true }
  };

  function applyBuildDefaults(options, defaults) {
    // Support deprecated show_stdout and show_stderr options.
    if (typeof options.stdout !== 'boolean' && typeof options.show_stdout === 'boolean') {
      options.stdout = options.show_stdout;
    }
    if (typeof options.stderr !== 'boolean' && typeof options.show_stderr === 'boolean') {
      options.stderr = options.show_stderr;
    }

    return applyDefaults(options, parametersSpec, defaults);
  }

  // open up a seam for testing
  msb.processOptions = processOptions;

  msb.setDefaults = function (options) {
    defaults = applyBuildDefaults(options, getPaprikaDefaults());
  };
  msb.resetDefaults = function () {
    defaults = getPaprikaDefaults();
  };

  return msb;
}());

