var zip = require('../lib/paprika').zip
  , arch = process.arch;

describe('zip', function () {
  beforeEach(function() {
    // reset arch
    process.arch = arch;
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
      expect(procname).toEqual('zip-x86.exe');
    });

    it('should use the 64-bit executable on 64-bit macines', function () {
      process.arch = 'x64';
      go();
      expect(procname).toEqual('zip-x64.exe');
    });
  });
});