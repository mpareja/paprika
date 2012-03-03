var zip = require('../lib/paprika').zip
  , arch = process.arch;

describe('zip', function () {
  var called
    , procname
    , args
    , go = function(theArguments) {
        zip(theArguments || {}, function(name, receivedArgs) {
          called = true;
          procname = name;
          args = receivedArgs;
        });
      };

  beforeEach(function() {
    // reset state
    process.arch = arch;
    called = false;
    procname = null;

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

  it('should pass cmd line arguments array when executing the zip process.', function () {
    go(['my arguments']);
    expect(args).toEqual(['my arguments']);
  });

  it('should convert single string cmd line arguments to array when executing the zip process', function () {
    go('my arguments');
    expect(args).toEqual(['my arguments']);
  });

  describe('on windows', function () {
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