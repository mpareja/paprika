var path = require('path')
  , fs = require('fs')
  , file = require('file');

desc('Run jshint on all javascript files.');
task('lint', function () {
  var jshint = path.join('node_modules', '.bin', 'jshint');
  jake.exec([jshint + ' src'], function () {
    console.log('Passed JSHint tests.');
    complete();
  }, {stdout: true, async: true});
});

desc('Add license to header of source files.');
task('license', function () {
  var license = fs.readFileSync('LICENSE', 'utf8'),
  
  includeLicense = function (file) {
    var data = fs.readFileSync(file, 'utf8');
    if (data.indexOf(license) !== 0) {
      fs.writeFileSync(file, license + data);
    }
  };

  file.walkSync('src', function (dir, dirs, files) {
    files.forEach(function (file) {
      if (path.extname(file) === '.js') {
        includeLicense(file);
      }
    });
  });
});


task('default', ['license', 'lint']);
