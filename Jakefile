var path = require('path'),
  fs = require('fs'),
  pckg = require('./package'),
  glob = require('glob'),
  spawn = require('child_process').spawn;

desc('Run JSLint on all javascript files.');
task('lint', function () {
  var args = [
      path.join('node_modules', 'jslint', 'bin', 'jslint.js'),
      '--devel',
      '--node',
      '--vars',
      '--maxerr=100',
      '--indent=2',
      '--sloppy=true', // don't require "use strict" everywhere
      '--nomen=true', // don't give warnings for __dirname
      '--undef',
      '--'
    ],
    files = glob.sync('./lib/*.js');

  // lint the Jakefile
  files.push('Jakefile');

  // HACK: redirect output directly to file descriptors 0,1 and 2
  // to avoid stream truncation issue on Windows.
  var handle = spawn('node', args.concat(files), { customFds: [0, 1, 2] });
  handle.on('exit', function (code) {
    if (code === 0) {
      console.log('Passed JSLint tests.');
    } else {
      fail('Failed JSLint tests.');
    }
    complete();
  });
}, { async: true });

desc('Run the jasmine tests.');
task('test', function () {
  var cmd = binpath('jasmine-node') + ' spec';
  jake.exec([cmd], checkForPass, { stdout: true, stderr: true, async: false });

  function checkForPass(code) {
    if (code !== 0) {
      fail('Tests failed.');
    }
    complete();
  }
});

// this exposes a 'package' task
var p = new jake.PackageTask(pckg.name, pckg.version, function () {
  this.needTarGz = true;
  this.packageFiles.include([
    'README.md',
    'package.json',
    'lib/ *'
  ]);
});

task('publish', ['package'], function () {
	var arc = pckg.name + '-' + pckg.version + '.tar.gz';
	console.log('Publishing pkg/' + arc + '.');
	jake.exec(['npm publish pkg/' + arc], function () {
		complete();
	}, {stdout: true});
});

task('default', ['lint', 'test']);

function binpath(lib) {
	return path.join('node_modules', '.bin', lib);
}
