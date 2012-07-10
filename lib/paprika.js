var fs = require('fs'),
  path = require('path');
if (!fs.exists) { fs.exists = path.exists; }
if (!fs.existsSync) { fs.existsSync = path.existsSync; }

exports.msbuild = require('./msbuild');
exports.nunit = require('./nunit');
exports.zip = require('./zip');
exports.run = require('./run');
exports.aspcompile = require('./aspcompile');
