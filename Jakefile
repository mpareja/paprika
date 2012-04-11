var path = require('path'),
  fs = require('fs'),
  pckg = require('./package'),
  glob = require('glob'),
  run = require('./lib/paprika').run;

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
      '--plusplus',
      '--minusminus',
      '--'
    ],
    files = glob.sync('./lib/*.js');

  // lint the Jakefile
  files.push('Jakefile');

  execute('node', args.concat(files), '*** JSLint passed. ***', '!!! JSLint FAILED. !!!');
}, { async: true });

desc('Run the jasmine tests.');
task('test', function () {
  var cmd = path.join('node_modules', 'jasmine-node', 'bin', 'jasmine-node');
  execute('node', [cmd, 'spec'], '*** Tests passed. ***', '!!! Tests FAILED. !!!');
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

task('autotest', function () {
  test();
  function test() {
    console.log('-------- Running Tests ---------\n\n');
    var cmd = path.join('node_modules', 'jasmine-node', 'bin', 'jasmine-node');
    run('node', [cmd, 'spec'], function () {
      setTimeout(test, 3000);
    });
  }
});

task('push', ['lint', 'test'], function () {
  run('git', 'push', complete);
}, { async: true });

task('default', ['lint', 'test']);

function binpath(lib) {
	return path.join('node_modules', '.bin', lib);
}

function execute(cmd, args, successMessage, failureMessage, dontComplete) {
  run(cmd, args, function (code) {
    if (code === 0) {
      console.log(successMessage);
    } else {
      fail(failureMessage);
    }
    if (!dontComplete) {
      complete();
    }
  });
}

