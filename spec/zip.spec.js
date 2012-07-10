var zip = require(process.env.paprika || '..').zip
  , log = process.env.paprika ? require(process.env.paprika).log : require('../lib/log')
  , arch = process.arch
  , platform = process.platform
  , fs = require('fs')
  , path = require('path');

log.level = 'none';

describe('zip', function () {
  var called
    , procname
    , args
    , go = function(theArguments, expectations) {
        zip(theArguments || [], function () {
            if (expectations) {
              expectations();
              asyncSpecDone();
            }
          }, function(name, receivedArgs) {
          called = true;
          procname = name;
          args = receivedArgs;
        });
        if (expectations) {
          asyncSpecWait();
        }
      }
    , reset = function () {
        process.arch = arch;
        process.platform = platform;
        called = false;
        procname = null;
      };

  beforeEach(function() {
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
  
  afterEach(reset);

  it('should pass cmd line arguments array when executing the zip process.', function () {
    go(['my arguments'], function () {
      expect(args).toEqual(['my arguments']);
    });
  });

  it('should convert single string cmd line arguments to array when executing the zip process', function () {
    go('my arguments', function () {
      expect(args).toEqual(['my arguments']);
    });
  });

  describe('on non-windows machine', function () {
    beforeEach(function () {
      process.platform = 'linux';
    });

    it('should execute the system-wide zip process', function () {
      go(null, function () {
        expect(procname).toEqual('zip');
      });
    });
  });

  describe('on windows machine', function () {
    beforeEach(function () {
      process.platform = 'win32';
    });

    it('should execute a child process', function () {
      go(null, function () {
        expect(called).toBeTruthy();
      });
    });

    if (process.env.paprika) {
      // don't run these tests in combined mode since
      // we don't package up zip executables
      return;
    }

    it('should use the 32-bit executable on 32-bit machines', function() {
      process.arch = 'ia32';
      go(null, function () {
        expect(procname).toEndWith('zip-x86.exe');
      });
    });

    it('should use the 64-bit executable on 64-bit macines', function () {
      process.arch = 'x64';
      go(null, function () {
        expect(procname).toEndWith('zip-x64.exe');
      });
    });

    it('should use the zip executable in the tools dir.', function () {
      go(null, function () {
        expect(procname).toStartWith(
          path.join(process.cwd(), 'tools', 'zip'));
      });
    });
  });
});

describe('zip integration test', function () {
  var target = 'ziptest.zip'
    , assertExists = function() { 
        fs.exists(target, function (exists) {
            expect(exists).toBeTruthy();
            if (exists) {
              fs.unlinkSync(target);
            }
            asyncSpecDone();
        });
      };

  if (process.env.paprika && process.platform === 'win32') {
    // If in combined mode, only try and run this test
    // if there is a system-wide zip executable. We're cheating
    // and assuming one exists on all non-windows machines.
    return;
  }

  it('should be able to zip files', function () {
    var handle = zip(['-r', target, 'tools'], function (handle) {
      handle.on('exit', function(code) {
        expect(code).toEqual(0);
        assertExists();
      });
    });
    /*
    handle.stdout.on('data', function (data) {
      console.log((data.toString()));
    });
    handle.stderr.on('data', function (data) {
      console.log((data.toString()));
    });
    */
    asyncSpecWait();
  });
});
