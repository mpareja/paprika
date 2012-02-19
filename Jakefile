var path = require('path');

desc('Run jshint on all javascript files.');
task('lint', function () {
  var jshint = path.join('node_modules', '.bin', 'jshint');
  jake.exec([jshint + ' src'], function () {
    console.log('Passed JSHint tests.');
    complete();
  }, {stdout: true, async: true});
});


task('default', ['lint']);
