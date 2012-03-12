var msb = require('../lib/paprika').msbuild;

function getDefaultExpected() {
  return {
    file: 'somefile',
    targets: ['Build'],
    processor: 'x86',
    version: 'net35',
    stdout: true,
    stderr: true
  };
}

describe('default msbuild options', function() {
  var options;
  beforeEach(function () {
    options = msb.processOptions({
      file: 'somefile',
      version: 'net35'
    });
  });

  it('should use x86 processor', function () {
    expect(options.processor).toEqual('x86');
  });

  it('should use Build as the target', function () {
    expect(options.targets).toEqual(['Build']);
  });

  it('should show stdout', function () {
    expect(options.stdout).toBeTruthy();
  });

  it('should show stderr', function () {
    expect(options.stderr).toBeTruthy();
  });

  it('should not have default build properties', function () {
    expect(options.properties).toBeUndefined();
  });

  it('should not have default extra parameters', function () {
    expect(options.extraParameters).toBeUndefined();
  });
});

describe('inline msbuild settings', function () {
  var options,
    processWithInline = function (name, value) {
      var inline = { 
        file: 'somefile',
        version: 'net35'
      };
      inline[name] = value;

      options = msb.processOptions(inline);
      var expected = getDefaultExpected();
      expected[name] = value;
      expect(options).toEqual(expected);
    };

  it('should allow setting an inline file', function () {
    processWithInline('file', 'otherfile');
  });

  it('should allow setting an inline target', function () {
    processWithInline('targets', ['Test']);
  });

  it('should allow setting an inline processor', function () {
    processWithInline('processor', 'x64');
  });

  it('should allow setting an inline version', function () {
    processWithInline('version', 'net20');
  });
});

describe('overridden msbuild defaults', function () {
  var options,
    processWithOverride = function (name, value) {
      var overrides = { version: 'net35' };
      overrides[name] = value;
      msb.setDefaults(overrides);

      options = msb.processOptions({
        file: 'somefile'
      });

      var expected = getDefaultExpected();
      if (name === 'show_stdout') {
        expected['stdout'] = value;
      } else if (name === 'show_stderr') {
        expected['stderr'] = value;
      } else {
        expected[name] = value;
      }
      expect(options).toEqual(expected);
    };

  afterEach(function () { msb.resetDefaults(); });

  it('should allow overriding the target', function() {
    processWithOverride('targets', ['Clean']);
  });

  it('should allow overriding the processor', function () {
    processWithOverride('processor', 'x64');
  });

  it('should allow overriding the show stdout default', function () {
    processWithOverride('show_stdout', false);
  });

  it('should allow overriding the show stderr default', function () {
    processWithOverride('show_stderr', false);
  });

  it('should allow overriding the show stdout default', function () {
    processWithOverride('stdout', false);
  });

  it('should allow overriding the show stderr default', function () {
    processWithOverride('stderr', false);
  });

  it('should allow overriding the properties', function () {
    processWithOverride('properties', { Configuration: 'Release' });
  });

  it('should allow overriding the build command', function () {
    processWithOverride('buildCommand', 'xbuild');
  });

  it('should allow overriding extra parameters', function () {
    processWithOverride('extraParameters', 'myparm');
  });

  it('should allow setting a default framework version', function () {
    processWithOverride('version', 'net11');
  });
});

