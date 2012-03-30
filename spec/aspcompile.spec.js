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

  describe('when calling compiler', function () {
    var run = aspcompile.run,
      cmd = null,
      args = null,
      run_options = null;
      mockRun = function (foundcmd, foundargs, options) {
        cmd = foundcmd;
        args = foundargs;
        run_options = options;
      };

    beforeEach(function () { aspcompile.run = mockRun; });
    afterEach(function () {
      aspcompile.run = run;
      aspcompile.resetDefaults();
      cmd = null;
      args = null;
      run_options = null;
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

    it('should allow specifying a default version', function () {
      setDefaultAndAssert('version', 'net35');
      expect(cmd).toMatch(/v2\.0/);
    });

    it('should allow specifying a default processor', function () {
      setDefaultAndAssert('processor', 'x64');
      expect(cmd).toMatch(/Framework64/);
    });

    it('should allow specifying a default virtualPath', function () {
      setDefaultAndAssert('virtualPath', '/some/other/path');
      expect(args).toContain('/some/other/path');
    });

    it('should allow specifying a default physicalPath', function () {
      setDefaultAndAssert('physicalPath', '/a/different/path');
      expect(args).toContain('/a/different/path');
    });

    it('should allow specifying a default target directory', function () {
      setDefaultAndAssert('targetPath', '/a/target');
      expect(args).toContain('/a/target');
    });

    it('should allow specifying the target directory', function () {
      var options = getValidOptions();
      options.targetPath = '/a/path';
      aspcompile(options);
      expect(args).toContain('/a/path');
    });

    it('should not forward options to run by default', function () {
      aspcompile(getValidOptions());
      expect(run_options).toBeFalsy();
    });

    it('should allow specifying default run_options', function () {
      aspcompile.setDefaults({ run_options: { stdout: false } });
      aspcompile(getValidOptions());
      expect(run_options).toBeTruthy();
    });

    it('should forward run_options to run() when invoking compiler', function () {
      var options = getValidOptions();
      options.run_options = { stdout: false };
      aspcompile(options);
      expect(run_options).toBeTruthy();
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
          version: 'net35',
          run_options: { stdout: false }
        }, callback);
      asyncSpecWait();
    });
  });
});
