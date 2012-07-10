var combinedModules = [
  "d:\\projects\\paprika\\lib\\aspcompile.js",
  "d:\\projects\\paprika\\lib\\flow.js",
  "d:\\projects\\paprika\\lib\\log.js",
  "d:\\projects\\paprika\\lib\\msbuild.js",
  "d:\\projects\\paprika\\lib\\nunit.js",
  "d:\\projects\\paprika\\lib\\options.js",
  "d:\\projects\\paprika\\lib\\paprika.js",
  "d:\\projects\\paprika\\lib\\run.js",
  "d:\\projects\\paprika\\lib\\zip.js"
];
var futureExports = {};

var path = require('path');
function getRequire(dirname) {
  return function (mod) {
    if (/\//.test(mod)) {
      var desired = stripJsExt(path.resolve(dirname, mod)),
        isLocal = combinedModules.some(function (combined) {
          return stripJsExt(combined) === desired;
        });

      if (isLocal) {
        var moduleName = getModule(desired);
        var module = loadModule(moduleName);
        if (module) {
          return module;
        }
      }
    }
    return require(mod);
  }
}

function getModule(filepath) {
  var file = path.basename(filepath);
  return stripJsExt(file);
}

function stripJsExt(filepath) {
  return filepath.replace(/\.js$/, '');
}

function loadModules() {
  Object.keys(futureExports).forEach(loadModule);
}

function loadModule(mod) {
  var module = exports[mod];
  if (!module) {
    module = exports[mod] = futureExports[mod]();
  }
  return module;
}
/* aspcompile */
futureExports['aspcompile'] = function () {
  var module = { exports: {} },
    exports = module.exports,
    require = getRequire('d:\\projects\\paprika\\lib');

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
var run = require('./run'),
  path = require('path'),
  applyDefaults = require('./options').applyDefaults,
  validateParameters = require('./options').validateParameters,
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

var aspcompile = module.exports = function (options, callback) {
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

  aspcompile.run(exe, args, opts.run_options, callback || defaultCallback);

  function defaultCallback(code) {
    if (code !== 0) {
      throw new Error('FAILED: ASP.NET Compilation.');
    }
  }
};

aspcompile.setDefaults = function (options) {
  defaultOptions = applyDefaults(options, parametersSpec, getDefaults());
};
aspcompile.resetDefaults = function () {
  defaultOptions = getDefaults();
};

// open up seam for testing
aspcompile.run = run;

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


  return module.exports;
};
/* flow */
futureExports['flow'] = function () {
  var module = { exports: {} },
    exports = module.exports,
    require = getRequire('d:\\projects\\paprika\\lib');

exports.series = function (fns, callback) {
  var i = 0, length = fns.length;

  fns[i](handler);

  function handler(err) {
    if (err) {
      return callback(err);
    }
    i++;
    if (i < length) {
      fns[i](handler);
    } else {
      callback(null);
    }
  }
};

exports.parallel = function (fns, callback) {
  var errors = null, count = 0, length = fns.length;
  fns.forEach(function (fn) {
    fn(done);
  });

  function done(err) {
    if (err) {
      errors = errors || [];
      errors.push(err);
    }

    count++;
    if (count >= length) {
      return callback(errors);
    }
  }
};



  return module.exports;
};
/* log */
futureExports['log'] = function () {
  var module = { exports: {} },
    exports = module.exports,
    require = getRequire('d:\\projects\\paprika\\lib');

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
exports.info = function (message) {
  switch (this.level) {
  case 'info':
  case 'debug':
    console.log('INFO: ' + message);
    break;
  }
};
exports.debug = function (message) {
  if (this.level === 'debug') {
    console.log('DEBUG: ' + message);
  }
};
exports.level = 'info';


  return module.exports;
};
/* msbuild */
futureExports['msbuild'] = function () {
  var module = { exports: {} },
    exports = module.exports,
    require = getRequire('d:\\projects\\paprika\\lib');

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



  return module.exports;
};
/* nunit */
futureExports['nunit'] = function () {
  var module = { exports: {} },
    exports = module.exports,
    require = getRequire('d:\\projects\\paprika\\lib');

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
var run = require('./run'),
  path = require('path'),
  fs = require('fs'),
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

var nunit = module.exports = function (testDlls, opts, callback) {
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
  var verifyFrameworkExists = [
    function (cb) { fs.exists(options.nunitDir, getExistsCallback(cb)); },
    function (cb) {
      nunitPath = path.join(options.nunitDir, nunitExe);
      fs.exists(nunitPath, getExistsCallback(cb));
    }
  ];
  series(verifyFrameworkExists, runTests);

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


  return module.exports;
};
/* options */
futureExports['options'] = function () {
  var module = { exports: {} },
    exports = module.exports,
    require = getRequire('d:\\projects\\paprika\\lib');

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
exports.applyDefaults = function (options, spec, defaults) {
  var name, value, output = {};
  options = options || {};
  Object.getOwnPropertyNames(spec).forEach(function (name) {
    var opt = spec[name];

    output[name] = typesMatch(name, opt.type, options)
      ? options[name]
      : defaults[name];
  });
  return output;
};

exports.validateParameters = function (options, spec) {
  options = options || {};
  Object.getOwnPropertyNames(spec).forEach(function (name) {
    var opt = spec[name];
    if (opt.required) {
      if (typesMatch(name, opt.type, options) === false) {
        throw new Error('Missing parameter: ' + name + '.');
      }
    }
  });
};

function typesMatch(name, type, options) {
  if (type === 'array') {
    return Array.isArray(options[name]);
  }
  return typeof options[name] === type;
}


  return module.exports;
};
/* paprika */
futureExports['paprika'] = function () {
  var module = { exports: {} },
    exports = module.exports,
    require = getRequire('d:\\projects\\paprika\\lib');

var fs = require('fs'),
  path = require('path');
if (!fs.exists) { fs.exists = path.exists; }
if (!fs.existsSync) { fs.existsSync = path.existsSync; }

exports.msbuild = require('./msbuild');
exports.nunit = require('./nunit');
exports.zip = require('./zip');
exports.run = require('./run');
exports.aspcompile = require('./aspcompile');


  return module.exports;
};
/* run */
futureExports['run'] = function () {
  var module = { exports: {} },
    exports = module.exports,
    require = getRequire('d:\\projects\\paprika\\lib');

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
/*

   run(cmd, args, options, callback);
   run(cmd, args, options); // throws on failure
   run(cmd, args, callback);
   run(cmd, args); // throws on failure
   run(cmd, options, callback); // throws on failure
   run(cmd, options); // throws on failure
   run(cmd, callback);
   run(cmd) // throws on failure;

   runShellCmds(cmdAndArgs, options, callback)
   runShellCmds(cmdAndArgs, options) // throws on failure
   runShellCmds(cmdAndArgs, callback)
   runShellCmds(cmdAndArgs) // throws on failure
*/
var spawn = require('child_process').spawn;

var run = module.exports = function () {
  var options = processArguments.apply(null, arguments),
    handle;

  if (process.platform === 'win32') {
    handle = spawnWithIoOnWindows(options);
  } else {
    handle = spawnWithIoOnOtherOses(options);
  }

  if (options.callback) {
    handle.on('exit', options.callback);
  }
};

function spawnWithIoOnWindows(o) {
  // HACK: redirect output directly to file descriptors 0,1 and 2
  // to avoid stream truncation issue on Windows.
  var customFds = [
    0,
    o.options.stdout ? 1 : -1,
    o.options.stderr ? 2 : -1
  ];
  var options = o.options.spawn_options || {};
  options.customFds = customFds;
  return spawn(o.cmd, o.args, options);
}

function spawnWithIoOnOtherOses(o) {
  var handle = spawn(o.cmd, o.args);

  if (o.options.stdout) {
    handle.stdout.on('data', function (data) {
      console.log(stripNewline(data.toString()));
    });
  }

  if (o.options.stderr) {
    handle.stderr.on('data', function (data) {
      console.warn(stripNewline(data.toString()));
    });
  }

  function stripNewline(str) {
    if (!str) {
      return '';
    }
    return str.replace(/\n$/, '');
  }

  return handle;
}

// open up a seam for testing
run.processArguments = processArguments;

function processArguments() {
  var args = {
      args: [],
      options: { stdout: true, stderr: true }
    },
    params = Array.prototype.slice.call(arguments),
    next = params.shift(),
    i;

  if (typeof next !== 'string') {
    throw new Error('Invalid parameter: cmd.');
  }
  args.cmd = next;

  for (i = 0; i < params.length; i++) {
    next = params[i];
    if (next) {
      switch (typeof next) {
      case 'object':
        if (next.shift) {
          args.args = next;
        } else {
          args.options = applyDefaults(next);
        }
        break;
      case 'function':
        args.callback = next;
        break;
      case 'string':
        args.args = [next];
        break;
      }
    }
  }

  return args;
}

function applyDefaults(options) {
  return {
    stdout: typeof options.stdout === 'boolean'
      ? options.stdout
      : true,
    stderr: typeof options.stderr === 'boolean'
      ? options.stderr
      : true,
  };
}


  return module.exports;
};
/* zip */
futureExports['zip'] = function () {
  var module = { exports: {} },
    exports = module.exports,
    require = getRequire('d:\\projects\\paprika\\lib');

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
var childProcess = require('child_process'),
  path = require('path'),
  fs = require('fs'),
  log = require('./log');

module.exports = function (args, cb, mockSpawn) {
  var spawn = mockSpawn || childProcess.spawn;
  if (typeof args === 'string') {
    args = [args];
  }
  findExecutable(execute);

  function execute(exec) {
    log.info('Executing ' + exec + ' ' + args.join(' '));
    cb(spawn(exec, args));
  }
};

function findExecutable(callback) {
  var zipexec;
  if (process.platform === 'win32') {
    var winpath = getWinPath();
    fs.exists(winpath, function (exists) {
      callback(exists ? winpath : 'zip');
    });
  } else {
    // use the system-wide zip utility
    process.nextTick(function () { callback('zip'); });
  }
}
function getWinPath() {
  var filename = process.arch === 'x64'
    ? 'zip-x64.exe'
    : 'zip-x86.exe';
  return path.normalize(
    path.join(__dirname, '..', 'tools', 'zip', filename)
  );
}


  return module.exports;
};
loadModules();
