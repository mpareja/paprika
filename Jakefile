var path = require('path')
  , fs = require('fs')
  , package = require('./package')
  , glob = require('glob')
  , spawn = require('child_process').spawn;

desc('Run JSLint on all javascript files.');
task('lint', function () {
  var args = [
      path.join('node_modules', 'jslint', 'bin', 'jslint.js'),
      '--devel=true',
      '--node=true',
      '--vars=true',
      '--maxerr=100',
      '--indent=2',
      '--'
    ],
    files = glob.sync('./lib/*.js');

  // HACK: redirect output directly to file descriptors 0,1 and 2
  // to avoid stream truncation issue on Windows.
  var handle = spawn('node', args.concat(files), { customFds: [0,1,2] });
  handle.on('exit', function(code) {
    if (code === 0) {
      console.log('Passed JSLint tests.');
    }
    else {
      fail('Failed JSLint tests.');
    }
    complete();
  });
}, { async: true });

desc('Run the jasmine tests.');
task('test', function () {
  jake.exec([binpath('jasmine-node') + ' spec'], function (code) {
      complete();
  }, { stdout:true, async: false });
});

// having this exposes a 'package' task
var p = new jake.PackageTask(package.name, package.version, function () {
	this.needTarGz = true;
	this.packageFiles.include([
		'README.md'
	,	'package.json'
	, 'lib/*'
	]);
});

task('publish', ['package'], function () {
	var arc = package.name + '-' + package.version + '.tar.gz';
	console.log('Publishing pkg/' + arc + '.');
	jake.exec(['npm publish pkg/' + arc], function () {
		complete();
	}, {stdout: true});
});

task('default', ['lint', 'test']);

function binpath (package) {
	return path.join('node_modules', '.bin', package);
}
