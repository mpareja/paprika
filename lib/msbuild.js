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
      'x86': 'Framework'
    , 'x64': 'Framework64'
  };
  var versions = {
      'net1.0': '1.0.3705'
    , 'net10': '1.0.3705'
    , 'net1.1': '1.1.4322'
    , 'net11': '1.1.4322'
    , 'net2.0': '2.0.50727'
    , 'net20': '2.0.50727'
    , 'net3.5': '3.5'
    , 'net35': '3.5'
    , 'net4.0': '4.0.30319'
    , 'net40': '4.0.30319'
  };

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
      return;
    }
    if (!options.file) {
      fail('Invalid MSBuild project file.');
      return;
    }
    if (typeof options.show_stdout !== 'boolean') {
      options.show_stdout = true;
    }
    if (typeof options.show_stderr !== 'boolean') {
      options.show_stderr = true;
    }
    options.processor = options.processor || 'x86';
    options.targets = options.targets || ['Build'];
  };

  var stripNewline = function (str) {
      if (!str)
          return '';
      return str.replace(/\n$/, '');
  };

  return function (options, callback) {
    processOptions(options);

    var msbuildPath = buildPath(options.version, options.processor)
      , args = [
            options.file
          , '/t:' + options.targets.join(';')
          , getProperties(options.properties)
          ]
      , handle;

    if (options.extraParameters) {
      args.push(options.extraParameters);
    }

    if (options.buildCommand) {
      msbuildPath = options.buildCommand;
    }

    handle = spawn(msbuildPath, args);

    if (options.show_stdout) {
      handle.stdout.on('data', function (data) {
        log(stripNewline(data.toString()));
      });
    }

    if (options.show_stderr) {
      handle.stderr.on('data', function (data) {
        logError(stripNewline(data.toString()));
      });
    }

    handle.on('exit', function (code) {
      if (code !== 0) {
        fail('Running MSBuild failed with error code: ' + code);
      }
    });
  };
}());

