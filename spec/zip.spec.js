var zip = require('../lib/paprika').zip
  , arch = process.arch;

describe('zip', function () {
  beforeEach(function() {
    // reset arch
    process.arch = arch;

    this.addMatchers({
      toEndWith: function(expected) {
        var ix = this.actual.lastIndexOf(expected)
          , length = this.actual.length;

        if (ix < 0)
          return false;
        return (length - ix) === expected.length;
      },
      toStartWith: function(expected) {
        return this.actual.indexOf(expected) === 0;
      }
    });
  });

  describe('on windows', function () {
    var called, procname
      , go = function() {
          zip({}, function(name) {
            called = true;
            procname = name;
          });
        };

    it('should execute a child process', function () {
      go();
      expect(called).toBeTruthy();
    });

    it('should use the 32-bit executable on 32-bit machines', function() {
      process.arch = 'ia32';
      go();
      expect(procname).toEndWith('zip-x86.exe');
    });

    it('should use the 64-bit executable on 64-bit macines', function () {
      process.arch = 'x64';
      go();
      expect(procname).toEndWith('zip-x64.exe');
    });

    it('should use the zip executable in the tools dir.', function () {
      go();
      expect(procname).toStartWith(
        require('path').join(process.cwd(), 'tools'));
    });
  });
});