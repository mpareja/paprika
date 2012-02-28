var path = require('path')
	,	fs = require('fs')
	, package = require('./package');

desc('Run jshint on all javascript files.');
task('lint', function () {
  var jshint = path.join('node_modules', '.bin', 'jshint');
  jake.exec([jshint + ' lib'], function () {
    console.log('Passed JSHint tests.');
    complete();
  }, {stdout: true, async: true});
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

task('default', ['lint']);
