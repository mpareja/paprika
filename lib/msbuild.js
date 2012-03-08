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
var path = require('path')
  , spawn = require('child_process').spawn
  , log = console.log
  , logError = console.error
  , fail = fail || function (message) {
      log(message);
      throw message;
    };

exports.msbuild = (function () {
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
    var theVersion = versions[version]
      , theProcessor = processors[processor];

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
    var result = ''
      , prop;
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

    var opts = applyDefaults(options, defaults);
    if (!opts.file) {
      fail('Invalid MSBuild project file.');
    }
    if (!opts.version) {
      console.log(JSON.stringify(opts));
      fail('Missing Framework version.');
    }
    return opts;
  };

  var stripNewline = function (str) {
      if (!str)
          return '';
      return str.replace(/\n$/, '');
  };

  var msb = function (options, callback) {
    var opts = processOptions(options);

    var msbuildPath = buildPath(opts.version, opts.processor)
      , args = [
            opts.file
          , '/t:' + opts.targets.join(';')
          , getProperties(opts.properties)
          ]
      , handle;

    if (opts.extraParameters) {
      args.push(opts.extraParameters);
    }

    if (opts.buildCommand) {
      msbuildPath = opts.buildCommand;
    }

    handle = spawn(msbuildPath, args);

    if (opts.show_stdout) {
      handle.stdout.on('data', function (data) {
        log(stripNewline(data.toString()));
      });
    }

    if (opts.show_stderr) {
      handle.stderr.on('data', function (data) {
        logError(stripNewline(data.toString()));
      });
    }

    handle.on('exit', function (code) {
      if (code !== 0) {
        fail('Running MSBuild failed with error code: ' + code);
      }
      if (callback) {
        callback();
      }
    });
  };

  function getPaprikaDefaults() {
    return {
      show_stdout: true,
      show_stderr: true,
      processor: 'x86',
      targets: ['Build']
    };
  }

  function applyDefaults(options, defaults) {
    return {
      file: options.file,
      show_stdout: typeof options.show_stdout === 'boolean' ?
        options.show_stdout : defaults.show_stdout,
      show_stderr: typeof options.show_stderr === 'boolean' ?
        options.show_stderr : defaults.show_stderr,
      processor: typeof options.processor === 'string' ?
        options.processor : defaults.processor,
      targets: typeof options.targets === 'object' ?
        options.targets : defaults.targets,
      properties: typeof options.properties === 'object' ?
        options.properties : defaults.properties,
      buildCommand: typeof options.buildCommand === 'string' ?
        options.buildCommand : defaults.buildCommand,
      extraParameters: typeof options.extraParameters === 'string' ?
        options.extraParameters : defaults.extraParameters,
      version: typeof options.version === 'string' ?
        options.version : defaults.version // only set if overriden
    };
  }

  // open up a seam for testing
  msb.processOptions = processOptions;

  msb.setDefaults = function (options) {
    defaults = applyDefaults(options, getPaprikaDefaults());
  };
  msb.resetDefaults = function () {
    defaults = getPaprikaDefaults();
  };

  return msb;
}());

