exports.ensureParameterSet = function (options, parameter, type) {
  if (typeof options[parameter] !== type) {
    throw new Error('Missing parameter: ' + parameter + '.');
  }
};
