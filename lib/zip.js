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
    path.exists(winpath, function (exists) {
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
