var aspcompile = require('../lib/paprika').aspcompile,
  getValidOptions = function () {
    return {
      virtualPath: '/myapp',
      physicalPath: '/some/path',
      version: 'net35',
      processor: 'x86'
    }
  };

describe('aspcompile', function () {
  function callWithoutParameter(parameter) {
    var options = getValidOptions();
    delete options[parameter];
    aspcompile(options);
  }
  describe('required parameters', function () {
    it('should require the virtual path', function () {
      expect(function () {
        callWithoutParameter('virtualPath');
      }).toThrow('Missing parameter: virtualPath.');
    });

    it('should require the physical path', function () {
      expect(function () {
        callWithoutParameter('physicalPath');
      }).toThrow('Missing parameter: physicalPath.');
    });

    it('should require the .NET Framework version', function () {
      expect(function () {
        callWithoutParameter('version');
      }).toThrow('Missing parameter: version.');
    });

    it('should require the .NET Framework processor architecture to use.', function () {
      expect(function () {
        callWithoutParameter('processor');
      }).toThrow('Missing parameter: processor.');
    });
  });

  describe('configuring default parameters', function () {
    var run = aspcompile.run,
      cmd = null,
      args = null,
      mockRun = function (foundcmd, foundargs) {
        cmd = foundcmd;
        args = foundargs;
      };

    beforeEach(function () { aspcompile.run = mockRun; });
    afterEach(function () {
      aspcompile.run = run;
      cmd = null;
      args = null;
    });

    function setDefaultAndAssert(option, value) {
      var defaults = {};
      defaults[option] = value;
      aspcompile.setDefaults(defaults);

      var options = {
          virtualPath: '/myapp',
          physicalPath: '/some/path',
          processor: 'x86',
          version: 'net40'
      };
      delete options[option];
      aspcompile(options); // will throw if option not defined
    }

    it('should allow specifying the default version', function () {
      setDefaultAndAssert('version', 'net35');
      expect(cmd).toMatch(/v2\.0/);
    });

    it('should allow specifying the default processor', function () {
      setDefaultAndAssert('processor', 'x64');
      expect(cmd).toMatch(/Framework64/);
    });

    it('should allow specifying the default virtualPath', function () {
      setDefaultAndAssert('virtualPath', '/some/other/path');
      expect(args).toContain('/some/other/path');
    });

    it('should allow specifying the default physicalPath', function () {
      setDefaultAndAssert('physicalPath', '/a/different/path');
      expect(args).toContain('/a/different/path');
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
