exports.series = function () {
  var args = Array.prototype.slice.call(arguments),
    fns = args.slice(0, args.length - 1),
    callback = args[args.length - 1],
    i = 0;

  fns[i](handler);

  function handler(err) {
    if (err) {
      return callback(err);
    }
    i++;
    if (i < fns.length) {
      fns[i](handler);
    } else {
      callback(null);
    }
  }
};

exports.parallel = function (fns, callback) {
  var errors = null, count = 0;
  fns.forEach(function (fn) {
    fn(done);
  });

  function done(err) {
    if (err) {
      errors = errors || [];
      errors.push(err);
    }

    count++;
    if (count >= fns.length) {
      return callback(errors);
    }
  }
};

