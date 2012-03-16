var aspcompile = require('../lib/paprika').aspcompile;

describe('aspcompile', function () {
  describe('parameters', function () {
    it('should require the virtual path', function () {
      expect(function () {
        aspcompile({ physicalPath: '/some/path' });
      }).toThrow('Missing parameter: virtualPath.');
    });

    it('should require the physical path', function () {
      expect(function () {
        aspcompile({ virtualPath: '/myapp' });
      }).toThrow('Missing parameter: physicalPath.');
    });

    it('should require the .NET Framework version', function () {
      expect(function () {
        aspcompile({
          virtualPath: '/myapp',
          physicalPath: '/some/path',
          processor: 'x86'
        });
      }).toThrow('Missing parameter: version.');
    });

    it('should require the .NET Framework processor architecture to use.', function () {
      expect(function () {
        aspcompile({
          virtualPath: '/myapp',
          physicalPath: '/some/path',
          version: 'net35'
        });
      }).toThrow('Missing parameter: processor.');
    });
  });

  describe('non-windows OS', function () {
    var platform = process.platform;
    beforeEach(function () { process.platform = 'linux'; });
    afterEach(function () { process.platform = platform; });

    it('should not be able to perform compilation outside of Windows', function () {
      expect(function () {
        aspcompile({
          physicalPath: './does/not/exist',
          virtualPath: './also/does/not/exist',
          processor: 'x86',
          version: 'net35'
        });
      }).toThrow('FAILED: ASP.NET Compilation is only supported on Windows.');
    });
  });

  describe('integration tests', function () {
    if (process.platform !== 'win32') {
      return; // don't perform these tests on linux
    }

    it('should receive callback with error code on failure', function () {
      var callback = function (code) {
        expect(code).toEqual(1);
        asyncSpecDone();
      }
      aspcompile({
          physicalPath: './does/not/exist',
          virtualPath: './also/does/not/exist',
          processor: 'x86',
          version: 'net35'
        }, callback);
      asyncSpecWait();
    });
  });
});
