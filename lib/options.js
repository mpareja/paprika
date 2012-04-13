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
exports.applyDefaults = function (options, spec, defaults) {
  var name, value, output = {};
  Object.getOwnPropertyNames(spec).forEach(function (name) {
    var opt = spec[name];

    output[name] = typesMatch(name, opt.type, options)
      ? options[name]
      : defaults[name];
  });
  return output;
};

exports.validateParameters = function (options, spec) {
  Object.getOwnPropertyNames(spec).forEach(function (name) {
    var opt = spec[name];
    if (opt.required) {
      if (typesMatch(name, opt.type, options) === false) {
        throw new Error('Missing parameter: ' + name + '.');
      }
    }
  });
};

function typesMatch(name, type, options) {
  if (type === 'array') {
    return Array.isArray(options[name]);
  }
  return typeof options[name] === type;
}
