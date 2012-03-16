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
  run = require('./paprika').run;

exports.aspcompile = function (options, callback) {
  var opts = applyDefaults(options),
    exe = findCompilerExe(opts),
    args = [
      '-v',
      opts.virtualPath,
      '-p',
      opts.physicalPath,
      opts.updatable ? '-u' : '',
      opts.debug ? '-d -errorstack' : '',
      '-nologo'
    ];

  run(exe, args, callback);
};

function applyDefaults(options) {
  ensureParameterSet(options, 'virtualPath', 'string');
  ensureParameterSet(options, 'physicalPath', 'string');
  ensureParameterSet(options, 'processor', 'string');
  ensureParameterSet(options, 'version', 'string');

  return {
    virtualPath: options.virtualPath,
    physicalPath: options.physicalPath,
    processor: options.processor,
    version: options.version,
    updatable: typeof options.updatable === 'boolean'
      ? options.updatable : false,
    debug: typeof options.debug === 'boolean'
      ? options.debug : false
  };
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
      fail("Invalid .NET framework version '" + version + "' or processor '" + processor + "'");
      return;
    }

    return path.join(process.env.WINDIR, 'Microsoft.Net', theProcessor, 'v' + theVersion, "aspnet_compiler.exe");
  };
}());
