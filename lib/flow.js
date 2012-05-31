exports.series = function (fns, callback) {
  var i = 0, length = fns.length;

  fns[i](handler);

  function handler(err) {
    if (err) {
      return callback(err);
    }
    i++;
    if (i < length) {
      fns[i](handler);
    } else {
      callback(null);
    }
  }
};

exports.parallel = function (fns, callback) {
  var errors = null, count = 0, length = fns.length;
  fns.forEach(function (fn) {
    fn(done);
  });

  function done(err) {
    if (err) {
      errors = errors || [];
      errors.push(err);
    }

    count++;
    if (count >= length) {
      return callback(errors);
    }
  }
};

