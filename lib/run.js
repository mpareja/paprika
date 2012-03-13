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

exports.run = function () {
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
  return spawn(o.cmd, o.args, { customFds: customFds });
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
exports.run.processArguments = processArguments;

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
