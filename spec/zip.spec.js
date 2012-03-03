var zip = require('../lib/paprika').zip
  , arch = process.arch
  , platform = process.platform
  , fs = require('fs')
  , path = require('path');

describe('zip', function () {
  var called
    , procname
    , args
    , go = function(theArguments) {
        zip(theArguments || [], function(name, receivedArgs) {
          called = true;
          procname = name;
          args = receivedArgs;
        });
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
    go(['my arguments']);
    expect(args).toEqual(['my arguments']);
  });

  it('should convert single string cmd line arguments to array when executing the zip process', function () {
    go('my arguments');
    expect(args).toEqual(['my arguments']);
  });

  describe('on non-windows machine', function () {
    beforeEach(function () {
      process.platform = 'linux';
    });

    it('should execute the system-wide zip process', function () {
      go();
      expect(procname).toEqual('zip');
    });
  });

  describe('on windows machine', function () {
    beforeEach(function () {
      process.platform = 'win32';
    });

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
      require('path').join(process.cwd(), 'tools', 'zip'));
    });
  });
});

describe('zip integration test', function () {
  var target = 'ziptest.zip'
    , assertExists = function() { 
        path.exists(target, function (exists) {
            expect(exists).toBeTruthy();
            if (exists) {
              fs.unlinkSync(target);
            }
            asyncSpecDone();
        });
      };

  it('should be able to zip files', function () {
    var handle = zip(['-r', target, 'tools']);
    handle.on('exit', function(code) {
      expect(code).toEqual(0);
      assertExists();
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
