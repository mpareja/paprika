var childProcess = require('child_process')
  , path = require('path');

exports.zip = function (args, mockSpawn) {
  var spawn = mockSpawn || childProcess.spawn
    , exec = findExecutable();
  if (typeof(args) === 'string') {
    args = [args];
  }
  spawn(exec, args);
};

function findExecutable() {
  var filename;
  if (process.platform === 'win32') {
    if (process.arch === 'x64')
      filename = 'zip-x64.exe';
    else
      filename ='zip-x86.exe';

    return path.normalize(path.join(
      __dirname, '..', 'tools', 'zip', filename));
  }
  else {
    return 'zip'; // use the system-wide zip utility
  }
}
