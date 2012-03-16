var aspcompile = require('../lib/paprika').aspcompile;

describe('aspcompile', function () {
  it('should require the virtual path', function () {
    expect(function () {
      aspcompile({ physicalPath: '/some/path' });
    }).toThrow(new Error('Missing parameter: virtualPath.'));
  });

  it('should require the physical path', function () {
    expect(function () {
      aspcompile({ virtualPath: '/myapp' });
    }).toThrow(new Error('Missing parameter: physicalPath.'));
  });

  it('should require the .NET Framework version', function () {
    expect(function () {
      aspcompile({
        virtualPath: '/myapp',
        physicalPath: '/some/path',
        processor: 'x86'
      });
    }).toThrow(new Error('Missing parameter: version.'));
  });

  it('should require the .NET Framework processor architecture to use.', function () {
    expect(function () {
      aspcompile({
        virtualPath: '/myapp',
        physicalPath: '/some/path',
        version: 'net35'
      });
    }).toThrow(new Error('Missing parameter: processor.'));
  });
});
