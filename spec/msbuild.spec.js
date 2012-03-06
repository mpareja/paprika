var msb = require('../lib/paprika').msbuild;

describe('default msbuild options', function() {
  var options;
  beforeEach(function () {
    options = msb.processOptions({
      file: 'somefile'
    });
  });

  it('should use x86 processor', function () {
    expect(options.processor).toEqual('x86');
  });

  it('should use Build as the target', function () {
    expect(options.targets).toEqual(['Build']);
  });

  it('should show stdout', function () {
    expect(options.show_stdout).toBeTruthy();
  });

  it('should show stderr', function () {
    expect(options.show_stderr).toBeTruthy();
  });

  it('should not have default build properties', function () {
    expect(options.properties).toBeUndefined();
  });

  it('should not have default extra parameters', function () {
    expect(options.extraParameters).toBeUndefined();
  });
});

describe('overridden msbuild defaults', function () {
  var options,
    getDefaultExpected = function() {
      return {
        file: 'somefile',
        targets: ['Build'],
        processor: 'x86',
        show_stdout: true,
        show_stderr: true
      };
    },
    processWithOverride = function (name, value) {
      var overrides = {};
      overrides[name] = value;
      msb.setDefaults(overrides);

      options = msb.processOptions({ file: 'somefile' });

      var expected = getDefaultExpected();
      expected[name] = value;
      expect(options).toEqual(expected);
    };

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

  it('should allow overriding the properties', function () {
    processWithOverride('properties', { Configuration: 'Release' });
  });

  it('should allow overriding the build command', function () {
    processWithOverride('buildCommand', 'xbuild');
  });

  it('should allow overriding extra parameters', function () {
    processWithOverride('extraParameters', 'myparm');
  });
});

